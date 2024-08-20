interface SidebarItem {
  name: string;
  url?: string;
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
