import type { MeetingMetadata } from "@/utils/reactMeetingMetadata";

interface SidebarItem {
  name: string;
  url?: string;
  metadata?: MeetingMetadata; /* non-generic optional field for meetings */
  active?: boolean;
  items?: SidebarItem[];
}

interface SidebarProps {
  root_items: SidebarItem[];
  expand_all?: boolean;
  id?: string;
}

interface SidebarItemProps {
  item: SidebarItem;
  depth?: number;
  expand_all?: boolean;
  id?: string;
}
