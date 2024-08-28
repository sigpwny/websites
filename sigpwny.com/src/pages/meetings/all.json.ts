import { getMeetings } from '@/utils/meetings';

import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import utc from 'dayjs/plugin/utc';
import advanced from 'dayjs/plugin/advancedFormat';

dayjs.extend(duration);
dayjs.extend(utc);
dayjs.extend(advanced);


export async function GET(context: any) {
  const meetings = await getMeetings();
  return new Response(JSON.stringify(meetings))
}
