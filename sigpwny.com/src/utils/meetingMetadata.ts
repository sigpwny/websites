export const meetingMetatypes = [
    'general',
    'ctf',
    'purple',
    'embedded',
  ];
  
export type MeetingMetatype = typeof meetingMetatypes[number];
  
export interface MeetingMetadata {
id: MeetingMetatype;
name: string;
shortName: string;
color: string;
}
  

export const meetingMetadata: Record<MeetingMetatype, MeetingMetadata> = {
    'general': { id: 'general', name: 'General', shortName: 'General', color: 'pwny-green' },
    'ctf': { id: 'ctf', name: 'CTF Team', shortName: 'CTF', color: 'pwny-red' },
    'purple': { id: 'purple', name: 'Purple Team', shortName: 'Purple', color: 'pwny-purple' },
    'embedded': { id: 'embedded', name: 'Embedded Team', shortName: 'Embedded', color: 'pwny-yellow' },
};