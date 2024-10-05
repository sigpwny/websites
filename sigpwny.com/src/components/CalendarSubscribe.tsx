import { useEffect, useState } from 'react';
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from '@/components/Popover';
import Menu from '@/components/Menu';
import {
  AppleSvg,
  GoogleCalendarSvg,
  MicrosoftOutlookSvg
} from '$/components/Icons';
import {
  CalendarRegular,
  CalendarSyncRegular,
  CheckboxCheckedFilled,
  CheckboxUncheckedFilled,
  CheckmarkCircleFilled,
  LinkRegular
} from '$/components/Icons/fluentui';
import {
  reactMeetingMetadata,
} from '@/utils/reactMeetingMetadata';
import { type MeetingMetatype } from '$/utils/meetingMetadata';

interface CalendarSubscribeProps {
  selected: MeetingMetatype[];
  placement?: 'top' | 'bottom' | 'left' | 'right';
}

export default function CalendarSubscribe({ selected, placement }: CalendarSubscribeProps) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [selectedCalendars, setSelectedCalendars] = useState<MeetingMetatype[]>(selected);

  useEffect(() => {
    setSelectedCalendars(selected);
  }, [selected]);

  // TODO: Don't hardcode these
  const genericWebcalUrl = `webcal://sigpwny.com/calendar/${selectedCalendars.sort().join('-')}/generic.ics`;
  const appleWebcalUrl = `webcal://sigpwny.com/calendar/${selectedCalendars.sort().join('-')}/apple.ics`;
  const name = 'SIGPwny ' + selectedCalendars.sort().map((id) => reactMeetingMetadata[id].shortName).join(',');

  const handleCopy = () => {
    navigator.clipboard.writeText(genericWebcalUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  }

  return (
    <Popover open={open} onOpenChange={setOpen} placement={placement}>
      <div className="flex flex-row gap-2 items-center">
        <div className="flex flex-shrink-0 flex-grow-0">
          <PopoverTrigger
            onClick={() => setOpen(!open)}
            className={`btn-primary flex flex-row gap-2 items-center ${open ? "ring-primary ring-2 ring-offset-2 ring-offset-surface-000" : ""}`}
          >
            <CalendarSyncRegular className="text-black" />
            <span>
              Subscribe to Calendar
            </span>
          </PopoverTrigger>
        </div>
      </div>
      <div className="absolute top-full mt-2 left-0">
        <PopoverContent>
          <Menu>
            <ul>
              {Object.entries(reactMeetingMetadata).map(([meeting_type, metadata]) => (
                <li
                  key={meeting_type}
                  style={{ "--color-checkbox": metadata.color } as React.CSSProperties}
                >
                  {selectedCalendars.includes(meeting_type) ? (
                    <button onClick={() => setSelectedCalendars(selectedCalendars.filter((id) => id !== meeting_type))}>
                      <CheckboxCheckedFilled className="text-[var(--color-checkbox)]" />
                      <span>
                        {metadata.name}
                      </span>
                    </button>
                  ) : (
                    <button onClick={() => setSelectedCalendars([...selectedCalendars, meeting_type])}>
                      <CheckboxUncheckedFilled className="brightness-50" />
                      <span>
                        {metadata.name}
                      </span>
                    </button>
                  )}
                </li>
              ))}
            </ul>
            <span className="border-b-2 border-surface-300" />
            <ul>
              <li>
                <a
                  href={appleWebcalUrl}
                  className={selectedCalendars.length === 0 ? 'pointer-events-none brightness-50' : undefined}
                >
                  <AppleSvg className="mx-0.5" />
                  <span className="ml-0.5">
                    Apple Calendar
                  </span>
                </a>
              </li>
              <li>
                <a
                  href={`https://calendar.google.com/calendar/r?cid=${genericWebcalUrl}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={selectedCalendars.length === 0 ? 'pointer-events-none brightness-50' : undefined}
                >
                  <GoogleCalendarSvg className="mx-0.5" />
                  <span className="ml-0.5">
                    Google Calendar
                  </span>
                </a>
              </li>
              <li>
                <a
                  href={`https://outlook.office.com/owa?path=/calendar/action/compose&rru=addsubscription&url=${genericWebcalUrl}&name=${name}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={selectedCalendars.length === 0 ? 'pointer-events-none brightness-50' : undefined}
                >
                  <MicrosoftOutlookSvg className="mx-0.5" />
                  <span className="ml-0.5">
                    Microsoft Outlook
                  </span>
                </a>
              </li>
            </ul>
            <span className="border-b-2 border-surface-300" />
            <ul>
              <li>
                <a
                  href={genericWebcalUrl}
                  className={selectedCalendars.length === 0 ? 'pointer-events-none brightness-50' : undefined}
                >
                  <CalendarRegular />
                  <span>
                    Other (system calendar)
                  </span>
                </a>
              </li>
              <li className="w-full">
                <button
                  onClick={handleCopy}
                  className={selectedCalendars.length === 0 ? 'pointer-events-none brightness-50' : 'w-full'}
                >
                  {copied ? (
                    <CheckmarkCircleFilled className="text-primary" />
                  ) : (
                    <LinkRegular />
                  )}
                  <span>
                    Copy Link (webcal)
                  </span>
                </button>
              </li>
            </ul>
          </Menu>
        </PopoverContent>
      </div>
    </Popover>
  )
}