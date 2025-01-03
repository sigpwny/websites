import React from 'react';
import {
  EmbeddedChipFilledSvg,
  EmbeddedChipRegularSvg
} from '$/components/Icons';
import {
  BookOpenFilled,
  FlagFilled,
  FlagRegular,
  ShieldKeyholeFilled,
  ShieldKeyholeRegular
} from '$/components/Icons/fluentui';
import { type MeetingMetadata, type MeetingMetatype, meetingMetadata } from '$/utils/meetingMetadata';

export interface ReactMeetingMetadata extends MeetingMetadata {
  name: string;
  shortName: string;
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
    icon: <BookOpenFilled />
  },
  'ctf': {
    ...meetingMetadata['ctf'],
    color: 'rgb(var(--rgb-pwny-red))',
    icon: <FlagFilled />
  },
  'purple': {
    ...meetingMetadata['purple'],
    color: 'rgb(var(--rgb-pwny-purple))',
    icon: <ShieldKeyholeFilled />
  },
  'embedded': {
    ...meetingMetadata['embedded'],
    color: 'rgb(var(--rgb-pwny-yellow))',
    icon: <EmbeddedChipRegularSvg />
  },
};