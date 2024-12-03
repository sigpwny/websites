import requests
import json
import re
import html
from slugify import slugify
from dotenv import load_dotenv
import os
from pathlib import Path
import httplib2
import os
import random
import sys
import time
from typing import List, Optional

from apiclient.discovery import build
from apiclient.errors import HttpError
from apiclient.http import MediaFileUpload
from oauth2client.client import flow_from_clientsecrets
from oauth2client.file import Storage
from oauth2client.tools import argparser, run_flow
from dataclasses import dataclass

KALTURA_BASE = 'https://mediaspace.illinois.edu/'
CLIENT_VERSION = 'v2.101'
UICONF_ID = '41571891'
API_VERSION = '3.1'

# Explicitly tell the underlying HTTP transport library not to retry, since
# we are handling retry logic ourselves.
httplib2.RETRIES = 1

# Maximum number of times to retry before giving up.
MAX_RETRIES = 10

# Always retry when these exceptions are raised.
RETRIABLE_EXCEPTIONS = (httplib2.HttpLib2Error, IOError)

# Always retry when an apiclient.errors.HttpError with one of these status
# codes is raised.
RETRIABLE_STATUS_CODES = [500, 502, 503, 504]

# The CLIENT_SECRETS_FILE variable specifies the name of a file that contains
# the OAuth 2.0 information for this application, including its client_id and
# client_secret. You can acquire an OAuth 2.0 client ID and client secret from
# the Google API Console at
# https://console.cloud.google.com/.
# Please ensure that you have enabled the YouTube Data API for your project.
# For more information about using OAuth2 to access the YouTube Data API, see:
#   https://developers.google.com/youtube/v3/guides/authentication
# For more information about the client_secrets.json file format, see:
#   https://developers.google.com/api-client-library/python/guide/aaa_client_secrets
CLIENT_SECRETS_FILE = "client_secrets.json"

# This OAuth 2.0 access scope allows an application to upload files to the
# authenticated user's YouTube channel, but doesn't allow other types of access.
YOUTUBE_UPLOAD_SCOPE = "https://www.googleapis.com/auth/youtube.upload"
YOUTUBE_API_SERVICE_NAME = "youtube"
YOUTUBE_API_VERSION = "v3"

@dataclass
class UploadOptions:
    file: str
    title: str
    description: str
    category: str
    tags: List[str]
    caption: Optional[str]

def fetch_media(username, password):
    headers = {
        'Referer': KALTURA_BASE,
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Safari/537.36',
    }

    s = requests.Session()
    
    print('Signing into Kaltura')

    response = s.get(f'{KALTURA_BASE}/user/login', headers=headers)
    config = json.loads(re.search(r'Config=({.*})', response.text).group(1))

    response = s.get('https://login.microsoftonline.com' + config['urlPost'])
    config = json.loads(re.search(r'Config=({.*})', response.text).group(1))

    response = s.post('https://login.microsoftonline.com' + config['urlPost'], data={
        "login": username,
        "passwd": password,
        "ctx": config['sCtx'],
        "flowToken": config['sFT'],
    })
    url, body, relay = re.search(r'action="(.*?)".*?value="(.*?)".*?RelayState.*?value="(.*?)"', response.text, re.DOTALL).groups()

    response = s.post(url, data={'SAMLResponse': body, "RelayState": relay})
    url, relay, body = re.search(r'action="(.*?)"(?:.|\n)*?value="(.*?)"(?:.|\n)*?value="(.*?)"', response.text, re.DOTALL).groups()

    s.post(html.unescape(url), data={'SAMLResponse': body, "RelayState": html.unescape(relay)})

    # for debugging, uncomment this
    s = requests.Session()
    s.cookies.set('kms_ctamuls', "2g4jot6n0pm52febdk12e7d4ei")

    body = {"controller": "user", "action": "user-media", "page": "1"}
    res = s.post(f'{KALTURA_BASE}/my-media', json=body)

    info, = re.search(r'MyMediaPage,\s+({.*?})\)', res.text).groups()
    info = json.loads(info)

    print('Getting a valid session')
    # pull out a KS value from a flashvars session
    first = s.get(f'{KALTURA_BASE}/edit/' + info['data'][0]['entry']['id'])
    ks, = re.search(r'var flashvars = {"ks":"(.*?)"', first.text).groups()


    entries = []

    for media in info['data']:
        print('Fetching video for', media['entry']['id'])
        entry = media['entry']
        resp =requests.get(f'https://cdnapisec.kaltura.com/html5/html5lib/{CLIENT_VERSION}/modules/KalturaSupport/download.php/wid/_{entry["partnerId"]}/uiconf_id/{UICONF_ID}/entry_id/{entry["id"]}', params={
            'forceDownload': 'true',
            'downloadName': entry['name'],
            'preferredBitrate': 0,
            'ks': ks,
        }, allow_redirects=False)
        entry['fullResDownloadUrl'] = resp.headers['Location']

        resp = requests.get(
        'https://cdnapisec.kaltura.com/api_v3/index.php',
        params={
            'service':'caption_captionasset',
            'apiVersion': API_VERSION,
            'expiry':'86400',
            'clientTag':f'kwidget:{CLIENT_VERSION}',
            'format':'1',
            'ignoreNull':'1',
            'action':'list',
            'filter:objectType':'KalturaAssetFilter',
            'filter:entryIdEqual':entry["id"],
            'filter:statusEqual':2,
            'pager:pageSize':50,
            'ks':ks,
        })
        caption_id = None
        for o in resp.json()['objects']:
            if o['label'] == 'Zoom_TRANSCRIPT':
                caption_id = o['id']
                break
        if caption_id:
            print('Fetching captions for', media['entry']['id'])
            resp = requests.get(
                'https://cdnapisec.kaltura.com/api_v3/index.php',
                params={
                    'service': 'multirequest',
                    'apiVersion': API_VERSION,
                    'expiry':'86400',
                    'clientTag':f'kwidget:{CLIENT_VERSION}',
                    'format':'1',
                    'ignoreNull':'1',
                    'action':'null',
                    '1:ks': ks,
                    '1:service': 'caption_captionasset',
                    '1:action': 'getUrl',
                    '1:id': caption_id
                }
            )
            url = resp.json()[0]
            entry['zoomTranscript'] = url
        else:
            entry['zoomTranscript'] = None
        del entry['relatedObjects']
        entries.append(entry)
    return entries

def get_authenticated_service():
    flow = flow_from_clientsecrets(CLIENT_SECRETS_FILE, scope=YOUTUBE_UPLOAD_SCOPE)

    storage = Storage("%s-oauth2.json" % sys.argv[0])
    credentials = storage.get()

    # This is an interactive flow
    if credentials is None or credentials.invalid:
        credentials = run_flow(flow, storage)

    return build(YOUTUBE_API_SERVICE_NAME, YOUTUBE_API_VERSION,
                 http=credentials.authorize(httplib2.Http()))



def do_upload(youtube, options):
    body = dict(
        snippet=dict(
            title=options.title,
            description=options.description,
            tags=options.tags,
            categoryId=options.category
        ),
        status=dict(
            privacyStatus="private"
        )
    )

    # Call the API's videos.insert method to create and upload the video.
    insert_request = youtube.videos().insert(
        part=",".join(body.keys()),
        body=body,
        media_body=MediaFileUpload(options.file, chunksize=-1, resumable=True)
    )

    video_id = resumable_upload(insert_request)

    if options.caption:
        upload_caption(youtube, video_id, 'en', 'English', MediaFileUpload(options.caption, chunksize=-1, resumable=True))

    print("Video id '%s' was successfully uploaded." % video_id)
def upload_caption(youtube, video_id, language, name, caption_file):
    request = youtube.captions().insert(
        part="snippet",
        body={
            "snippet": {
                "videoId": video_id,
                "language": language,
                "name": name,
                "isDraft": False
            }
        },
        media_body=caption_file
    )
    response = request.execute()
    return response

# This method implements an exponential backoff strategy to resume a
# failed upload.
def resumable_upload(insert_request):
    response = None
    error = None
    retry = 0
    while response is None:
        try:
            print("Uploading file...")
            status, response = insert_request.next_chunk()
            if response is not None:
                if 'id' in response:
                    return response['id']
                else:
                    exit("The upload failed with an unexpected response: %s" % response)
        except HttpError as e:
            if e.resp.status in RETRIABLE_STATUS_CODES:
                error = "A retriable HTTP error %d occurred:\n%s" % (e.resp.status,
                                                                     e.content)
            else:
                raise
        except RETRIABLE_EXCEPTIONS as e:
            error = "A retriable error occurred: %s" % e

        if error is not None:
            print(error)
            retry += 1
            if retry > MAX_RETRIES:
                exit("No longer attempting to retry.")

            max_sleep = 2 ** retry
            sleep_seconds = random.random() * max_sleep
            print("Sleeping %f seconds and then retrying..." % sleep_seconds)
            time.sleep(sleep_seconds)

def get_description(meeting):
    credit_fmt = meeting['data']['credit']
    if len(credit_fmt) <= 2:
        credit_fmt = ' and '.join(credit_fmt)
    else:
        credit_fmt = ', '.join(credit_fmt[:-1]) + ', and ' + credit_fmt[-1]
    
    start = meeting['data']['time_start'].split('T')[0]
    description = meeting['data'].get('description') or meeting['body'].replace('## Summary', '').strip()

    return f'''
    {description} Recorded on {start}.

    This meeting was run by {credit_fmt}.

    Meeting slides: https://sigpwny.com{meeting['slug']}
    '''

if __name__ == '__main__':
    load_dotenv()
    metadata = fetch_media(os.getenv('USERNAME'), os.getenv('PASSWORD'))
    metadata_lookup = {}
    for entry in metadata:
        zoom_id = re.search(r'Zoom Recording ID: (\d+)', entry['description'])
        if zoom_id:
            metadata_lookup[zoom_id.group(1)] = entry
    
    youtube = get_authenticated_service()

    meetings = json.load(Path('../../dist/meetings/all.json').open())
    for meeting in meetings:
        try:
            meeting_id = re.search(r'illinois.zoom.us/j/(\d+)', meeting['data']['live_video_url']).group(1) 
        except KeyError:
            continue
    
        title = meeting['data']['title']
        start = meeting['data']['time_start'].split('T')[0]
        if 'week_number' in meeting['data']:
            title = f'Week {str(meeting["data"]["week_number"]).zfill(2)}: {title}'
        title = f'{title} ({start})'
        tags = meeting['data']['tags']
        entry = metadata_lookup.get(meeting_id)
        description = get_description(meeting)
        if meeting['data'].get('recording') is None and entry is not None:
            print(f'{title}\n{"=" * len(title)}')
            print(description)
            print('=' * len(title))
            print(f'Meeting URL: https://sigpwny.com{meeting["slug"]}')
            video_location = Path('download.mp4')
            print(f'Downloading video from {entry["fullResDownloadUrl"]}')
            resp = requests.get(entry['fullResDownloadUrl'])
            with open(video_location, 'wb') as f:
                f.write(resp.content)
            
            caption_location = None
            if entry['zoomTranscript']:
                print(f'Downloading captions from {entry["zoomTranscript"]}')
                caption_location = Path('download.vtt')
                resp = requests.get(entry['zoomTranscript'])
                with open(caption_location, 'wb') as f:
                    f.write(resp.content)
            else:
                print('No captions available')
            
            print('Uploading to YouTube')
            try:
                do_upload(youtube,
                    UploadOptions(
                    file=video_location.absolute().as_posix(),
                    caption=caption_location.absolute().as_posix() if caption_location else None,
                    title=title,
                    description=get_description(meeting),
                    category='22',
                    tags=tags)
                )
            except HttpError as e:
                print("An HTTP error %d occurred:\n%s" % (e.resp.status, e.content))
    