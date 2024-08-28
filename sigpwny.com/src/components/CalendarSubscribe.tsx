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
  LinkRegular
} from '@/components/Icons/fluentui';


export default function CalendarSubscribe(props: any) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText("webcal://sigpwny.com/calendar/full.ics");
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
              <li>
                <a
                  href="webcal://sigpwny.com/calendar/full/apple.ics"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <AppleSvg />
                  <span className="inline align-middle">
                    Apple Calendar
                  </span>
                </a>
              </li>
              <li>
                <a
                  href="/gcal"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <GoogleCalendarSvg />
                  <span className="inline align-middle">
                    Google Calendar
                  </span>
                </a>
              </li>
              <li>
                <a
                  href="/outlook"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <MicrosoftOutlookSvg />
                  <span className="inline align-middle">
                    Microsoft Outlook
                  </span>
                </a>
              </li>
            </ul>
            <span className="border-b-2 border-surface-300" />
            <ul>
              <li>
                <a
                  href="webcal://sigpwny.com/calendar/full.ics"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <CalendarRegular width="1em" height="1em" />
                  <span className="inline align-middle">
                    Other (system calendar)
                  </span>
                </a>
              </li>
              <li className="w-full">
                <button
                  className="w-full"
                  onClick={handleCopy}
                >
                  <LinkRegular width="1em" height="1em" />
                  <span className="inline align-middle">
                    Copy Link (webcal)
                  </span>
                  {copied && (
                    <span className="inline align-middle ml-2 text-primary">
                      &#10004;
                    </span>
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