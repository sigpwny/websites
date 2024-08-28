import { getCollection, type CollectionEntry } from 'astro:content';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import utc from 'dayjs/plugin/utc';
import advanced from 'dayjs/plugin/advancedFormat';

dayjs.extend(duration);
dayjs.extend(utc);
dayjs.extend(advanced);


export async function GET(context: any) {
  const events = await getCollection('events') as CollectionEntry<'events'>[];
  return new Response(JSON.stringify(events))
}
