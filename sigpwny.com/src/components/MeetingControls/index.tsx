import { useEffect, useState } from 'react';

import { meetingMetadata, type MeetingMetadata, type MeetingMetatype, meetingMetatypes } from '@/utils/meetingMetadata';
import CalendarSubscribe from '@/components/CalendarSubscribe';

export default function MeetingControls() {
    const [selected, setSelected] = useState<MeetingMetatype[]>(['general', 'ctf']);

    useEffect(() => {
        console.log(selected)
        meetingMetatypes.forEach((id) => {
            document.getElementById('meetings')?.style.setProperty(`--${id}-visible`, selected.includes(id) ? 'block' : 'none');
        })
    }, [selected]);

    return (
    <div className="panel flex mb-2 justify-between">
        <div className="flex flex-row gap-2">
        {Object.values(meetingMetadata).map((metadata: MeetingMetadata) => (
            <button className="flex-none" onClick={() => setSelected(selected.includes(metadata.id) ? selected.filter((id) => id !== metadata.id) : [...selected, metadata.id])}>
                <div key={metadata.id} className={`px-1 md:px-2 py-1 text-sm md:text-md border-2 hover:border-${metadata.color} hover:bg-surface-300 ${selected.includes(metadata.id) ? `border-${metadata.color} bg-surface-300`: `border-surface-300 bg-surface-200`} rounded-lg`}>
                        {metadata.shortName}
                </div>
            </button>
        ))}
        </div>
        <div>
            <CalendarSubscribe selected={selected} />
        </div>
    </div>

    )
}