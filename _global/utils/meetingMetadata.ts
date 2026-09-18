export const meetingMetatypes = [
  'general',
  'seminar',
  'ctf',
  'embedded',
  'purple',
];

export type MeetingMetatype = typeof meetingMetatypes[number];

export interface MeetingMetadata {
  name: string;
  shortName: string;
  description?: string;
  /** Numeric brand color for previews; matches the meeting badge palette. */
  accentColor?: number;
};

export const meetingMetadata: Record<MeetingMetatype, MeetingMetadata> = {
  'general': {
    name: 'General Meetings',
    shortName: 'General',
    accentColor: 0x33cc55,
    description: 'Attend our weekly general meetings to learn the fundamentals of cybersecurity.',
  },
  'seminar': {
    name: 'Seminar Meetings',
    shortName: 'Seminar',
    accentColor: 0x41aaff,
    description: 'Discuss interesting, novel, and advanced research topics in security.',
  },
  'ctf': {
    name: 'CTF Team',
    shortName: 'CTF',
    accentColor: 0xff4040,
    description: 'Compete in Capture-the-Flag events to practice your cybersecurity skills.',
  },
  'embedded': {
    name: 'Embedded Team',
    shortName: 'Embedded',
    accentColor: 0xffc000,
    description: 'Build secure embedded systems and learn about hardware hacking.',
  },
  'purple': {
    name: 'Purple Team',
    shortName: 'Purple',
    accentColor: 0xdd5fff,
    description: 'Learn red-teaming and blue-teaming skills to secure systems and networks.',
  },
};