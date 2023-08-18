interface SidebarItem {
  name: string;
  url?: string;
  items?: SidebarItem[];
}

interface SidebarProps {
  root_items: SidebarItem[];
  expand_all?: boolean;
}

interface SidebarItemProps {
  item: SidebarItem;
  depth?: number;
  expand_all?: boolean;
}
