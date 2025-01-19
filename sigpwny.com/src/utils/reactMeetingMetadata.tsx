import React from 'react';
import { EmbeddedChipRegularSvg } from '$/components/Icons';
import {
  BookOpenFilled,
  FlagFilled,
  HatGraduationRegular,
  ShieldKeyholeFilled,
} from '$/components/Icons/fluentui';
import {
  meetingMetadata,
  type MeetingMetadata,
  type MeetingMetatype,
} from '$/utils/meetingMetadata';

export interface ReactMeetingMetadata extends MeetingMetadata {
  name: string;
  shortName: string;
  description?: string;
  color: string;
  icon?: React.JSX.Element;
}

export const reactMeetingMetadata: Record<MeetingMetatype, ReactMeetingMetadata> = {
  'general': {
    ...meetingMetadata['general'],
    color: 'rgb(var(--rgb-pwny-green))',
    icon: <BookOpenFilled />
  },
  'seminar': {
    ...meetingMetadata['seminar'],
    color: 'rgb(var(--rgb-pwny-blue))',
    icon: <HatGraduationRegular />
  },
  'ctf': {
    ...meetingMetadata['ctf'],
    color: 'rgb(var(--rgb-pwny-red))',
    icon: <FlagFilled />
  },
  'embedded': {
    ...meetingMetadata['embedded'],
    color: 'rgb(var(--rgb-pwny-yellow))',
    icon: <EmbeddedChipRegularSvg />
  },
  'purple': {
    ...meetingMetadata['purple'],
    color: 'rgb(var(--rgb-pwny-purple))',
    icon: <ShieldKeyholeFilled />
  },
};