import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import consts from '@/consts';

import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import utc from 'dayjs/plugin/utc';
import advanced from 'dayjs/plugin/advancedFormat';
dayjs.extend(duration);
dayjs.extend(utc);
dayjs.extend(advanced);


export async function GET(context: any) {
  const meetings = await getCollection('meetings');
  return rss({
    title: consts.title,
    description: consts.description,
    site: context.site,
    items: meetings.map((meeting) => ({
      title: meeting.data.title,
      description: meeting.data.description,
      pubDate: dayjs(meeting.data.time_start).toDate(),
      categories: meeting.data.tags,
      // content: meeting.content,
      link: `/meetings/${meeting.slug}/`,
    })),
  });
}
