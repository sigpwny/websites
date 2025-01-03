export const meetingMetatypes = [
  'general',
  'seminar',
  'ctf',
  'purple',
  'embedded',
];

export type MeetingMetatype = typeof meetingMetatypes[number];

export interface MeetingMetadata {
  name: string;
  shortName: string;
  description?: string;
};

export const meetingMetadata: Record<MeetingMetatype, MeetingMetadata> = {
  'general': {
    name: 'General Meetings',
    shortName: 'General',
    description: 'Attend our weekly general meetings to learn fundamental skills in cybersecurity.',
  },
  'seminar': {
    name: 'Seminar Meetings',
    shortName: 'Seminar',
    description: 'Attend our seminars to discuss advanced and novel research topics in cybersecurity.',
  },
  'ctf': {
    name: 'CTF Team',
    shortName: 'CTF',
    description: 'Compete in "Capture the Flag" events to hone your cybersecurity skills.',
  },
  'purple': {
    name: 'Purple Team',
    shortName: 'Purple',
    description: 'Learn red-teaming (offensive) and blue-teaming (defensive) skills to secure systems and networks.',
  },
  'embedded': {
    name: 'Embedded Team',
    shortName: 'Embedded',
    description: 'Build secure embedded systems and learn about hardware hacking!',
  },
};