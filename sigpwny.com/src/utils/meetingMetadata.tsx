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

export const meetingMetatypes = [
  'general',
  'ctf',
  'purple',
  'embedded',
];

export type MeetingMetatype = typeof meetingMetatypes[number];

export interface MeetingMetadata {
  name: string;
  shortName: string;
  color: string;
  icon?: React.JSX.Element;
}

export const meetingMetadata: Record<MeetingMetatype, MeetingMetadata> = {
  'general': {
    name: 'General',
    shortName: 'General',
    color: 'rgb(var(--rgb-pwny-green))',
    icon: <BookOpenFilled />
  },
  'ctf': {
    name: 'CTF Team',
    shortName: 'CTF',
    color: 'rgb(var(--rgb-pwny-red))',
    icon: <FlagFilled />
  },
  'purple': {
    name: 'Purple Team',
    shortName: 'Purple',
    color: 'rgb(var(--rgb-pwny-purple))',
    icon: <ShieldKeyholeFilled />
  },
  'embedded': {
    name: 'Embedded Team',
    shortName: 'Embedded',
    color: 'rgb(var(--rgb-pwny-yellow))',
    icon: <EmbeddedChipRegularSvg />
  },
};