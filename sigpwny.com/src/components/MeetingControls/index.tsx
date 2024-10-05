import { useEffect, useState } from 'react';

import {
  meetingMetadata,
  meetingMetatypes,
  type MeetingMetatype
} from '@/utils/meetingMetadata';
import CalendarSubscribe from '@/components/CalendarSubscribe';

export default function MeetingControls() {
  const [selected, setSelected] = useState<MeetingMetatype[]>(['general', 'ctf']);

  useEffect(() => {
    meetingMetatypes.forEach((id) => {
      const root = document.getElementById('meetings')
      if (root) {
        root.dataset[id] = selected.includes(id) ? 'visible' : 'hidden';
      }
    })
  }, [selected]);

  return (
    <div className="panel border border-surface-200 flex flex-col mb-4 overflow-hidden">
      <div className="flex flex-col md:flex-row gap-2 justify-between md:items-center">
        <div className="flex flex-wrap gap-2">
          {Object.entries(meetingMetadata).map(([meeting_type, metadata]) => (
            <button
              key={meeting_type}
              className={`flex flex-row gap-1 items-center px-2 py-1 size-fit text-sm md:text-md font-bold rounded-full border-2 hover:bg-surface-200 ${selected.includes(meeting_type) ? 'border-[var(--color-tag)] bg-surface-150': 'border-surface-300 hover:border-surface-200 bg-surface-150'}`}
              style={{ "--color-tag": metadata.color } as React.CSSProperties}
              onClick={() => setSelected(selected.includes(meeting_type) ? selected.filter((id) => id !== meeting_type) : [...selected, meeting_type])}
            >
              {metadata.icon ?? null}
              {metadata.shortName}
            </button>
          ))}
        </div>
        <CalendarSubscribe selected={selected} />
      </div>
    </div>
  )
}