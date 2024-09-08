export const meetingTypes = [
    'general',
    'ctf',
    'purple',
    'embedded',
  ];
  
export type MeetingType = typeof meetingTypes[number];
  
export interface MeetingMetadata {
id: MeetingType;
name: string;
calendarName: string;
}
  

export const meetingMetadata: Record<MeetingType, MeetingMetadata> = {
    'general': { id: 'general', name: 'General', calendarName: 'General' },
    'ctf': { id: 'ctf', name: 'CTF Team', calendarName: 'CTF' },
    'purple': { id: 'purple', name: 'Purple Team', calendarName: 'Purple' },
    'embedded': { id: 'embedded', name: 'Embedded Team', calendarName: 'Embedded' },
};