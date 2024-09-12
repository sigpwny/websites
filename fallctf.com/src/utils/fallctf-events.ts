import { getCollection } from 'astro:content';
import dayjs from 'dayjs';

export async function getFallCTFEvents() {
  const events = (await getCollection('events', (event) => event.data.series === 'fallctf')).sort(
    (a, b) => b.data.time_start.valueOf() - a.data.time_start.valueOf()
  );
  return events.map((event) => {
    return {
      ...event,
      data: {
        ...event.data,
        // Add semester field
        year: dayjs(event.data.time_start).format('YYYY'),
      },
      // Add slug field
      slug: `/${dayjs(event.data.time_start).format('YYYY')}/`,
    };
  });
}