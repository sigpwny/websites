import { useEffect, useRef, useState } from 'react';
import DropdownSelect from '@/components/DropdownSelect';
import Menu from '@/components/Menu';
import MeetingTypeBadge from '@/components/Meeting/TypeBadge';
import {
  RadioButtonFilled,
  RadioButtonRegular,
} from '$/components/Icons/fluentui';
import { reactMeetingMetadata } from '@/utils/reactMeetingMetadata';

type MeetingType = 'general' | 'seminar' | 'ctf' | 'embedded' | 'purple';

export interface MeetingSidebarEntry {
  title: string;
  slug: string;
  type: MeetingType;
  timeStart: number;
  timeClose: number;
  timezone: string;
}

export interface MeetingSidebarSemester {
  id: string;
  name: string;
  firstMeetingUrl: string;
  firstMeetingByType: Partial<Record<MeetingType, string>>;
}

interface Props {
  activeSlug: string;
  currentSemester: string;
  meetings: MeetingSidebarEntry[];
  semesters: MeetingSidebarSemester[];
}

const typeOrder: MeetingType[] = ['general', 'seminar', 'ctf', 'embedded', 'purple'];
const colorPaletteByType: Record<MeetingType, string> = {
  general: 'green',
  seminar: 'blue',
  ctf: 'red',
  embedded: 'yellow',
  purple: 'purple',
};
const typeMenuItemClassName = 'cursor-pointer !transition-none hover:!bg-surface-250';

function getFilterFromUrl(): MeetingType | null {
  const requestedType = new URLSearchParams(window.location.search).get('type');
  return typeOrder.includes(requestedType as MeetingType)
    ? requestedType as MeetingType
    : null;
}

function setFilterInUrl(selectedType: MeetingType | null) {
  const url = new URL(window.location.href);
  if (selectedType === null) {
    url.searchParams.delete('type');
  } else {
    url.searchParams.set('type', selectedType);
  }
  window.history.replaceState(window.history.state, '', url);
}

function setColorPalette(selectedType: MeetingType | null) {
  if (selectedType === null) {
    delete document.body.dataset.colorPalette;
  } else {
    document.body.dataset.colorPalette = colorPaletteByType[selectedType];
  }
}

export default function MeetingSidebar({
  activeSlug,
  currentSemester,
  meetings,
  semesters,
}: Props) {
  const [selectedType, setSelectedType] = useState<MeetingType | null>(null);
  const [now, setNow] = useState<number | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setSelectedType(getFilterFromUrl());
    setNow(Date.now());
  }, [activeSlug]);

  useEffect(() => {
    const applyColorPalette = () => setColorPalette(selectedType);
    applyColorPalette();
    document.addEventListener('astro:after-swap', applyColorPalette);
    return () => {
      document.removeEventListener('astro:after-swap', applyColorPalette);
    };
  }, [selectedType]);

  useEffect(() => () => {
    delete document.body.dataset.colorPalette;
  }, []);

  useEffect(() => {
    let scrollTop = 0;
    const saveScrollPosition = () => {
      scrollTop = scrollContainerRef.current?.scrollTop ?? 0;
    };
    const restoreScrollPosition = () => {
      scrollContainerRef.current?.scrollTo({ top: scrollTop });
    };
    document.addEventListener('astro:before-swap', saveScrollPosition);
    document.addEventListener('astro:after-swap', restoreScrollPosition);
    return () => {
      document.removeEventListener('astro:before-swap', saveScrollPosition);
      document.removeEventListener('astro:after-swap', restoreScrollPosition);
    };
  }, []);

  const updateType = (nextType: MeetingType | null) => {
    setSelectedType(nextType);
    setFilterInUrl(nextType);
    setColorPalette(nextType);
  };

  const meetingHref = (slug: string) => {
    return selectedType === null ? slug : `${slug}?type=${selectedType}`;
  };

  const semesterHref = (semester: MeetingSidebarSemester) => {
    if (selectedType === null) {
      return semester.firstMeetingUrl;
    }
    const firstMeetingUrl = semester.firstMeetingByType[selectedType];
    if (!firstMeetingUrl) {
      return semester.firstMeetingUrl;
    }
    return `${firstMeetingUrl}?type=${selectedType}`;
  };

  const filteredMeetings = selectedType === null
    ? meetings
    : meetings.filter((meeting) => meeting.type === selectedType);
  const activeMeetings = now === null
    ? []
    : filteredMeetings.filter((meeting) => meeting.timeClose > now);
  const pastMeetings = now === null
    ? filteredMeetings
    : filteredMeetings.filter((meeting) => meeting.timeClose <= now);
  const liveCount = now === null
    ? 0
    : activeMeetings.filter((meeting) => meeting.timeStart <= now).length;
  const activeHeading = liveCount === 0
    ? 'Upcoming'
    : liveCount === activeMeetings.length
      ? 'Live'
      : 'Live & Upcoming';
  const typeDisplayText = selectedType === null
    ? 'All Meetings'
    : (
      <span className="flex min-w-0 items-center gap-1">
        {reactMeetingMetadata[selectedType].icon}
        <span className="truncate">{reactMeetingMetadata[selectedType].shortName}</span>
      </span>
    );

  const renderMeeting = (meeting: MeetingSidebarEntry) => {
    const isActive = meeting.slug === activeSlug;
    const isExternal = /^https?:\/\//.test(meeting.slug);
    const date = new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: '2-digit',
      timeZone: meeting.timezone,
    }).format(meeting.timeStart);
    const minute = new Intl.DateTimeFormat('en-US', {
      minute: 'numeric',
      timeZone: meeting.timezone,
    }).formatToParts(meeting.timeStart).find((part) => part.type === 'minute')?.value;
    const time = new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
      minute: Number(minute) === 0 ? undefined : '2-digit',
      timeZone: meeting.timezone,
    }).format(meeting.timeStart);

    return (
      <li key={meeting.slug}>
        <a
          href={meetingHref(meeting.slug)}
          target={isExternal ? '_blank' : undefined}
          rel={isExternal ? 'noopener noreferrer' : undefined}
          aria-current={isActive ? 'page' : undefined}
          className={`relative flex flex-col gap-1 rounded-lg px-2 py-1 !text-content hover:bg-surface-100 active:bg-surface-050 ${isActive ? 'bg-surface-100' : ''}`}
        >
          {isActive ? (
            <span className="absolute left-0 top-1/2 h-[60%] w-1 -translate-y-1/2 rounded-lg bg-primary" />
          ) : null}
          <span className="flex items-center justify-between gap-2">
            <span className="flex min-w-0 items-center gap-2">
              {selectedType === null ? (
                <span
                  className="flex size-6 shrink-0 items-center justify-center rounded-full text-surface-000 [&>svg]:size-4"
                  style={{ backgroundColor: reactMeetingMetadata[meeting.type].color }}
                  aria-hidden="true"
                >
                  {reactMeetingMetadata[meeting.type].icon}
                </span>
              ) : null}
              <span className="truncate" title={meeting.title}>{meeting.title}</span>
            </span>
            <time className="shrink-0 font-mono text-xs" dateTime={new Date(meeting.timeStart).toISOString()}>
              {date}, {time}
            </time>
          </span>
        </a>
      </li>
    );
  };

  return (
    <div className="flex max-h-[75vh] flex-col">
      <div className="grid grid-cols-[max-content_minmax(0,1fr)] gap-2 p-2 pb-1 xl:grid-cols-2">
        <span className="w-max xl:w-full">
          <DropdownSelect
            displayText={semesters.find((semester) => semester.id === currentSemester)?.name ?? currentSemester}
            contentRootClassName="w-52"
          >
            <Menu className="custom-scrollbar !max-h-80">
              <ul className="!gap-0">
                {semesters.map((semester) => (
                  <li key={semester.id}>
                    <a
                      href={semesterHref(semester)}
                      className={`!px-2 !py-1 !transition-none ${semester.id === currentSemester ? '!bg-primary !text-surface-000 hover:!bg-secondary' : ''}`}
                    >
                      {semester.name}
                    </a>
                  </li>
                ))}
              </ul>
            </Menu>
          </DropdownSelect>
        </span>
        <DropdownSelect
          displayText={typeDisplayText}
          contentRootClassName="w-56"
          closeOnSelect={true}
          triggerClassName={selectedType === null ? undefined : '!text-surface-000 hover:brightness-110'}
          triggerStyle={selectedType === null ? undefined : {
            backgroundColor: reactMeetingMetadata[selectedType].color,
          }}
        >
          <Menu>
            <ul>
              <li>
                <button
                  type="button"
                  className={typeMenuItemClassName}
                  aria-pressed={selectedType === null}
                  onClick={() => updateType(null)}
                >
                  {selectedType === null ? (
                    <RadioButtonFilled className="size-5 shrink-0 text-content" />
                  ) : (
                    <RadioButtonRegular className="size-5 shrink-0 text-content/60" />
                  )}
                  <span>All Meetings</span>
                  <span className="ml-auto shrink-0 font-mono text-xs">{meetings.length}</span>
                </button>
              </li>
              {typeOrder.map((type) => (
                <li key={type}>
                  <button
                    type="button"
                    className={typeMenuItemClassName}
                    aria-pressed={selectedType === type}
                    onClick={() => updateType(type)}
                  >
                    {selectedType === type ? (
                      <RadioButtonFilled className="size-5 shrink-0 text-content" />
                    ) : (
                      <RadioButtonRegular className="size-5 shrink-0 text-content/60" />
                    )}
                    <MeetingTypeBadge type={type} fullName={true} />
                    <span className="ml-auto shrink-0 font-mono text-xs">
                      {meetings.filter((meeting) => meeting.type === type).length}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </Menu>
        </DropdownSelect>
      </div>
      <div ref={scrollContainerRef} className="custom-scrollbar overflow-y-auto px-2 pb-2">
        {activeMeetings.length > 0 ? (
          <section className="mb-3">
            <h2 className="m-0 px-2 py-1 text-base font-bold">{activeHeading}</h2>
            <ul className="flex flex-col gap-1">
              {activeMeetings.map(renderMeeting)}
            </ul>
          </section>
        ) : null}
        <section>
          <h2 className="m-0 px-2 py-1 text-base font-bold">Past meetings</h2>
          {pastMeetings.length > 0 ? (
            <ul className="flex flex-col gap-1">
              {pastMeetings.map(renderMeeting)}
            </ul>
          ) : (
            <p className="m-0 px-2 py-1 text-sm text-content/60">No meetings found.</p>
          )}
        </section>
      </div>
    </div>
  );
}
