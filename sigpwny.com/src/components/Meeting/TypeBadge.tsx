import { type MeetingMetatype } from '$/utils/meetingMetadata';
import {
  reactMeetingMetadata,
  type ReactMeetingMetadata,
} from '@/utils/reactMeetingMetadata';

interface Props {
  type: MeetingMetatype;
  fullName?: boolean;
  consistentWidth?: boolean;
};

export default function MeetingTypeBadge({ type, fullName, consistentWidth }: Props) {
  const metadata = reactMeetingMetadata[type] ?? {
    name: type,
    shortName: type,
    color: 'rgb(var(--rgb-pwny-green))',
  } as ReactMeetingMetadata;
  const nameToUse = fullName ? "name" : "shortName";
  // Calculate max length of the name being used across the input metadata and reactMeetingMetadata
  // This is used to calculate a consistent width for the badge
  // It's not the most elegant solution and doesn't scale well with longer names... but it works
  const maxNameLength = Math.max(
    metadata[nameToUse].length,
    ...[...Object.values(reactMeetingMetadata)].map((metadata) => metadata[nameToUse].length)
  );
  const badge = (
    <div
      className="badge flex flex-row gap-1 items-center text-sm md:text-md font-bold text-surface-000"
      style={{
        backgroundColor: metadata.color,
      }}
    >
      {metadata.icon ?? null}
      <span>{metadata[nameToUse]}</span>
    </div>
  );
  if (consistentWidth) {
    return (
      <span style={{ minWidth: consistentWidth ? `${maxNameLength + 4}ch` : undefined }}>
        {badge}
      </span>
    )
  }
  return badge;
};