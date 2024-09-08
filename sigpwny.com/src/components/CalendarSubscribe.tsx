import { useState } from 'react';
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
} from '@/components/Icons';
import {
  CalendarRegular,
  CalendarSyncRegular,
  CheckmarkCircleRegular,
  CheckmarkCircleFilled,
  LinkRegular
} from '@/components/Icons/fluentui';
import { meetingMetadata, type MeetingType } from '@/utils/meetingMetadata';

export default function CalendarSubscribe(props: any) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [selectedCalendars, setSelectedCalendars] = useState<MeetingType[]>(['general', 'events']);

  const handleCopy = () => {
    navigator.clipboard.writeText(`webcal://sigpwny.com/calendar/${selectedCalendars.sort().join('-')}.ics`);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  }

  return (
    <Popover open={open} onOpenChange={setOpen} placement={props.placement}>
      <div className="flex flex-row gap-2 items-center">
        <div className="flex flex-shrink-0 flex-grow-0">
          <PopoverTrigger
            onClick={() => setOpen(!open)}
            className={`btn-primary flex flex-row gap-2 items-center ${open ? "ring-primary ring-2 ring-offset-2 ring-offset-surface-000" : ""}`}
          >
            <CalendarSyncRegular className="flex-none text-black" />
            <span className="inline align-middle">
              Subscribe to Calendar
            </span>
          </PopoverTrigger>
        </div>
      </div>
      <div className="absolute top-full mt-2 left-0">
        <PopoverContent>
          <Menu>
            <ul>
              {Object.values(meetingMetadata).map((metadata) => (
                <li key={metadata.id}>
                  {selectedCalendars.includes(metadata.id) ? (
                    <button onClick={() => setSelectedCalendars(selectedCalendars.filter((id) => id !== metadata.id))}>
                      <CheckmarkCircleFilled className="flex-none text-primary" />
                      <span className="inline align-middle">
                        {metadata.name}
                      </span>
                    </button>
                  ) : (
                    <button onClick={() => setSelectedCalendars([...selectedCalendars, metadata.id])}>
                      <CheckmarkCircleRegular className="flex-none text-primary" />
                      <span className="inline align-middle">
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
                <a href={`webcal://sigpwny.com/calendar/${selectedCalendars.sort().join('-')}/apple.ics`}  style={ (selectedCalendars.length === 0) ? {pointerEvents: 'none'} : {} }>
                  <AppleSvg />
                  <span className={`inline align-middle ${selectedCalendars.length === 0 ? 'text-surface-300': ''}`}>
                    Apple Calendar
                  </span>
                </a>
              </li>
              <li>
                <a
                  href={`https://calendar.google.com/calendar/r?cid=webcal://sigpwny.com/calendar/${selectedCalendars.sort().join('-')}.ics`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={ (selectedCalendars.length === 0) ? {pointerEvents: 'none'} : {} }
                >
                  <GoogleCalendarSvg />
                  <span className={`inline align-middle ${selectedCalendars.length === 0 ? 'text-surface-300': ''}`}>
                    Google Calendar
                  </span>
                </a>
              </li>
              <li>
                <a
                  href={`https://outlook.office.com/owa?path=/calendar/action/compose&rru=addsubscription&url=https://sigpwny.com/calendar/${selectedCalendars.sort().join('-')}.ics&name=${selectedCalendars.sort().map((id) => meetingMetadata[id].calendarName).join(',')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={ (selectedCalendars.length === 0) ? {pointerEvents: 'none'} : {} }
                >
                  <MicrosoftOutlookSvg />
                  <span className={`inline align-middle ${selectedCalendars.length === 0 ? 'text-surface-300': ''}`}>
                    Microsoft Outlook
                  </span>
                </a>
              </li>
            </ul>
            <span className="border-b-2 border-surface-300" />
            <ul>
              <li>
                <a href={`webcal://sigpwny.com/calendar/${selectedCalendars.sort().join('-')}.ics`} style={ (selectedCalendars.length === 0) ? {pointerEvents: 'none'} : {} }>
                  <CalendarRegular width="1em" height="1em" />
                  <span className={`inline align-middle ${selectedCalendars.length === 0 ? 'text-surface-300': ''}`}>
                    Other (system calendar)
                  </span>
                </a>
              </li>
              <li className="w-full">
                <button
                  className="w-full"
                  onClick={handleCopy}
                  style={ (selectedCalendars.length === 0) ? {pointerEvents: 'none'} : {} }
                >
                  <LinkRegular width="1em" height="1em" />
                  <span className={`inline align-middle ${selectedCalendars.length === 0 ? 'text-surface-300': ''}`}>
                    Copy Link (webcal)
                  </span>
                  {copied && (
                    <CheckmarkCircleFilled className="ml-auto inline align-middle text-primary" />
                  )}
                </button>
              </li>
            </ul>
          </Menu>
        </PopoverContent>
      </div>
    </Popover>
  )
}