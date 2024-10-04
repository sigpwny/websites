import { scheduleJobs, Job } from '@reteps/github-action-scheduler';
import fs from 'fs';
import path from 'path';
import { Client, GatewayIntentBits, Events, type GuildScheduledEventCreateOptions, GuildScheduledEventEntityType, GuildScheduledEventPrivacyLevel, GuildScheduledEvent, type GuildScheduledEventEditOptions, GuildScheduledEventStatus } from 'discord.js';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import duration from 'dayjs/plugin/duration';
import advanced from 'dayjs/plugin/advancedFormat';
import { meetingMetadata } from '../utils/meetingMetadata';
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(duration);
dayjs.extend(advanced);


const fetchMeetings = async () => {
  const meetingsPath = path.join(__dirname, '..', '..', 'dist', 'meetings', 'all.json');
  if (fs.existsSync(meetingsPath)) {
      const data = fs.readFileSync(meetingsPath, 'utf8');
      return JSON.parse(data);
  }
}

const makeJob = (meeting: any, beforeDuration) => {
  const { data : { title, type, location, card_image, week_number, time_end, time_start, description }, body, filePath, slug } = meeting;

  /*
runs-on: ubuntu-latest
steps:
  - uses: actions/checkout@v4
  - name: Use Node.js
    uses: actions/setup-node@v4
    with:
      node-version: latest
  - run: npm ci
    working-directory: sigpwny.com
  - run: npm run send-discord-ping
    working-directory: sigpwny.com
  */

  const url = `https://sigpwny.com${slug}`;

  const formattedDuration = dayjs.duration(beforeDuration).format('D [days] H [hours] m [minutes]');
  const message = `**${title}** is in ${formattedDuration}!
  ${url}
  `;

  const runAt = time_start.subtract(beforeDuration);
  const job: Job = {
    date: runAt.toDate(),
    name: `helper ping ${title}`,
    'runs-on': 'ubuntu-latest',
    steps: [
      {
        uses: 'actions/checkout@v4',
      },
      {
        name: 'Use Node.js',
        uses: 'actions/setup-node@v4',
        with: {
          'node-version': 'latest',
        },
      },
      {
        run: 'npm ci',
        'working-directory': 'sigpwny.com',
      },
      {
        run: 'npm run send-discord-ping',
        'working-directory': 'sigpwny.com',
        env: {
          DISCORD_TOKEN: '${{ secrets.DISCORD_TOKEN }}',
          DISCORD_CHANNEL_ID: '${{ vars.DISCORD_CONTENT_CHANNEL_ID }}',
          DISCORD_SERVER_ID: '${{ secrets.DISCORD_SERVER_ID }}',
          DISCORD_B64_MESSAGE: Buffer.from(message).toString('base64'),
        }
      },
    ],
  };
  return job;
}

async function main() {
  const meetings = await fetchMeetings();
  const upcomingMeetings = meetings.map((meeting : any) => {
    return {
      ...meeting,
      data: {
          ...meeting.data,
          time_start: dayjs(meeting.data.time_start).tz(meeting.data.timezone),
          time_end: dayjs(meeting.data.time_start).tz(meeting.data.timezone).add(dayjs.duration(meeting.data.duration)),
      }
    }  
  }).filter((meeting: any) => meeting.data.time_start > dayjs());

  const pingNotice = [
    dayjs.duration({ days: 1 }),
    dayjs.duration({ hours: 1 })
  ]

  const jobs = upcomingMeetings.flatMap((meeting) => {
    return pingNotice.map((notice) => makeJob(meeting, notice));
  })

  scheduleJobs(jobs, {
    path: path.join(__dirname, '..', '..', '..', 'scheduled-pings.yml'),
    check: false,
    replace: true  
  });
}

main();