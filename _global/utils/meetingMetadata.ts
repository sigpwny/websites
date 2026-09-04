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
};

export const meetingMetadata: Record<MeetingMetatype, MeetingMetadata> = {
  'general': {
    name: 'General Meetings',
    shortName: 'General',
    description: 'Attend our weekly general meetings to learn the fundamentals of cybersecurity.',
  },
  'seminar': {
    name: 'Seminar Meetings',
    shortName: 'Seminar',
    description: 'Discuss interesting, novel, and advanced research topics in security.',
  },
  'ctf': {
    name: 'CTF Team',
    shortName: 'CTF',
    description: 'Compete in Capture-the-Flag events to practice your cybersecurity skills.',
  },
  'embedded': {
    name: 'Embedded Team',
    shortName: 'Embedded',
    description: 'Build secure embedded systems and learn about hardware hacking.',
  },
  'purple': {
    name: 'Purple Team',
    shortName: 'Purple',
    description: 'Learn red-teaming and blue-teaming skills to secure systems and networks.',
  },
};