interface SidebarItem {
  name: string;
  link?: string;
  items?: SidebarItem[];
}

interface SidebarProps {
  root_items: SidebarItem[];
}
