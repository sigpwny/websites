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
from oauth2client.client import flow_from_clientsecrets, Credentials
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
SCOPES = [
    "https://www.googleapis.com/auth/youtube.upload",
    "https://www.googleapis.com/auth/youtube.force-ssl",
    "https://www.googleapis.com/auth/youtube",
]

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
    
    print(f'Signing into Kaltura as {username}...')

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

    # for debugging, uncomment this and use a valid Kaltura cookie.
    # s = requests.Session()
    # s.cookies.set('kms_ctamuls', "75br1kn1n7ctjs7siqj2moolbm")

    body = {"controller": "user", "action": "user-media", "page": "1"}
    res = s.post(f'{KALTURA_BASE}/my-media', json=body)
    try:
        info, = re.search(r'MyMediaPage,\s+({.*?})\)', res.text).groups()
    except AttributeError:
        print('Failed to get info -- sign in most likely failed')
        os.exit(1)
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
    # Check for cached credentials
    youtube_oauth_creds = os.getenv('YOUTUBE_OAUTH_CREDS')
    headless = youtube_oauth_creds is not None
    if youtube_oauth_creds:
        # https://oauth2client.readthedocs.io/en/latest/_modules/oauth2client/file.html#Storage.locked_get
        credentials = Credentials.new_from_json(youtube_oauth_creds)
    else:
        storage = Storage("%s-oauth2.json" % sys.argv[0])
        credentials = storage.get()

    # Try an interactive flow
    if credentials is None or credentials.invalid:
        if headless:
            raise Exception('No credentials found, please run this script interactively first')
        
        flow = flow_from_clientsecrets(CLIENT_SECRETS_FILE, scope=SCOPES)
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
        media_body=MediaFileUpload(options.file, resumable=True)
    )

    print('Uploading video (this may take a while)...')
    response = insert_request.execute()
    # print(response)
    video_id = response['id']
    print("Video id '%s' was successfully uploaded." % video_id)
    if options.caption:
        upload_caption(youtube, video_id, 'en', 'English', MediaFileUpload(options.caption, chunksize=-1, resumable=True))
        print("Captions for video id '%s' were successfully uploaded." % video_id)

    return video_id
def fetch_all_videos(youtube):
    # Every YouTube channel has a special playlist that contains all uploaded videos.
    response = youtube.channels().list(part='contentDetails', mine=True).execute()
    uploads_playlist_id = response['items'][0]['contentDetails']['relatedPlaylists']['uploads']

    # use the youtube.playlistItems().list method to fetch the videos
    videos = {}
    next_page_token = None
    while True:
        request = youtube.playlistItems().list(
            part="snippet",
            playlistId=uploads_playlist_id,
            maxResults=50,
            pageToken=next_page_token
        )
        response = request.execute()
        for video in response['items']:
            title = video['snippet']['title']
            video_id = video['snippet']['resourceId']['videoId']
            url = re.search(r'https:\/\/sigpwny\.com[\S]*\/', video['snippet']['description'])
            if url:
                full_url = url.group(0)
                # Minh will love this workaround!
                full_url = full_url.replace('/meetings/fa2023', '/meetings/general')\
                .replace('/meetings/sp2023', '/meetings/general')
                videos[full_url] = video_id
            videos[title] = video_id
        
        next_page_token = response.get('nextPageToken')
        if not next_page_token:
            break
    
    # print(videos)
    return videos

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

def get_description(meeting):
    credit_fmt = meeting['data']['credit']
    if len(credit_fmt) <= 2:
        credit_fmt = ' and '.join(credit_fmt)
    else:
        credit_fmt = ', '.join(credit_fmt[:-1]) + ', and ' + credit_fmt[-1]
    
    start = meeting['data']['time_start'].split('T')[0]
    description = meeting['data'].get('description') or meeting.get('body', '')
    # https://stackoverflow.com/a/20078869/5684541
    description = ''.join([i if ord(i) < 128 else ' ' for i in description])
    description = re.sub(r'##\s+Summary', '', description).strip()

    return f'''
{description} Recorded on {start}.

This meeting was run by {credit_fmt}.

Meeting slides: https://sigpwny.com{meeting['slug']}
    '''.strip()

if __name__ == '__main__':
    load_dotenv()
    
    youtube = get_authenticated_service()

    meetings = json.load(Path('../../dist/meetings/all.json').open())
    youtube_videos = fetch_all_videos(youtube)

    metadata = fetch_media(os.getenv('KALTURA_USERNAME'), os.getenv('KALTURA_PASSWORD'))
    metadata_lookup = {}
    for entry in metadata:
        zoom_id = re.search(r'Zoom Recording ID: (\d+)', entry['description'])
        if zoom_id:
            metadata_lookup[zoom_id.group(1)] = entry
    
    for meeting in meetings:
        try:
            meeting_id = re.search(r'illinois.zoom.us/j/(\d+)', meeting['data']['live_video_url']).group(1) 
        except KeyError:
            continue
    
        title = meeting['data']['title']
        start = meeting['data']['time_start'].split('T')[0]
        if 'week_number' in meeting['data']:
            title = f'{meeting["data"]["semester"]} Week {str(meeting["data"]["week_number"]).zfill(2)}: {title}'
        title = f'{title} ({start})'
        tags = meeting['data']['tags']
        entry = metadata_lookup.get(meeting_id)
        description = get_description(meeting)
        
        has_recording = meeting['data'].get('recording') is not None and 'illinois.zoom.us' not in meeting['data']['recording']
        has_kaltura = entry is not None
        has_youtube = any([meeting['data']['title'] in yt_entry for yt_entry in youtube_videos]) or any([
            'https://sigpwny.com' + meeting['slug'] in yt_entry for yt_entry in youtube_videos
        ])
        if has_recording != has_youtube:
            print(f'{"=" * len(title)}\n{title}')
            print('[!!] Recording / YouTube mismatch')
            print(f'{has_recording=}, {has_kaltura=}, {has_youtube=}')
        
        if not has_recording and has_kaltura and not has_youtube:
            print(f'{"=" * len(title)}\n{title}')
            print(f'[U] Kaltura / YouTube mismatch (https://sigpwny.com{meeting["slug"]})')
            print(f'{has_recording=}, {has_kaltura=}, {has_youtube=}')

            video_location = Path('download.mp4')
            print()
            print(f'downloading mp4 from {entry["fullResDownloadUrl"]}')
            resp = requests.get(entry['fullResDownloadUrl'])
            with open(video_location, 'wb') as f:
                f.write(resp.content)
            
            caption_location = None
            if entry['zoomTranscript']:
                print(f'downloading vtt from {entry["zoomTranscript"]}')
                caption_location = Path('download.vtt')
                resp = requests.get(entry['zoomTranscript'])
                with open(caption_location, 'wb') as f:
                    f.write(resp.content)
            
            video_id = None
            try:
                print()
                upload = UploadOptions(
                    file=video_location.absolute().as_posix(),
                    caption=caption_location.absolute().as_posix() if caption_location else None,
                    title=title,
                    description=get_description(meeting),
                    category='22',
                    tags=tags)
                
                print(upload)
                video_id = do_upload(youtube, upload)
                print('Video available at https://www.youtube.com/watch?v=' + video_id)
            except HttpError as e:
                print("An HTTP error %d occurred:\n%s" % (e.resp.status, e.content))

    