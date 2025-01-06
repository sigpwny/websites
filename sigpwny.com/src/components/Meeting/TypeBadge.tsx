import { type MeetingMetatype } from '$/utils/meetingMetadata';
import {
  reactMeetingMetadata,
  type ReactMeetingMetadata,
} from '@/utils/reactMeetingMetadata';

export default function MeetingTypeBadge({ type }: { type: MeetingMetatype }) {
  const metadata = reactMeetingMetadata[type] ?? {
    name: type,
    shortName: type,
    color: 'rgb(var(--rgb-pwny-green))',
  } as ReactMeetingMetadata;
  return (
    <div className="badge flex flex-row gap-1 items-center text-sm md:text-md font-bold text-surface-000" style={{ backgroundColor: metadata.color }}>
      {metadata.icon ?? null}
      <span>{metadata.shortName}</span>
    </div>
  );
};