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
}

export const meetingMetadata: Record<MeetingMetatype, MeetingMetadata> = {
    'general': {
        name: 'General',
        shortName: 'General',
    },
    'ctf': {
        name: 'CTF Team',
        shortName: 'CTF',
    },
    'purple': {
        name: 'Purple Team',
        shortName: 'Purple',
    },
    'embedded': {
        name: 'Embedded Team',
        shortName: 'Embedded',
    },
};