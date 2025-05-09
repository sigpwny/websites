import { ChevronRightRegular } from '$/components/Icons/fluentui';
import './styles.css';
import type { SidebarItemProps, SidebarProps } from '@/components/Sidebar/types';


export const Sidebar = ({ root_items, expand_all, id }: SidebarProps) => {
  if (!id) id = "sidebar";
  return (
    <ul id={id} className="flex flex-col gap-1 w-full select-none">
      {root_items.map((item, idx) => (
        <SidebarItem key={idx} id={`${id}_${idx}`} item={item} expand_all={expand_all} />
      ))}
    </ul>
  )
};

export const SidebarItem = ({ item, depth, expand_all, id }: SidebarItemProps) => {
  const curr_depth = depth || 0;
  const new_depth = curr_depth + 1;
  const curr_id = id || "sidebar-item";
  const padding = {paddingLeft: `${curr_depth}em`};
  const { items, active, metadata, name, url } = item;

  // Expand subitems list if any subitem is active
  // const subitems_ref = useRef<HTMLUListElement>(null);
  // useEffect(() => {
  //   // if (subitems_ref.current?.querySelector(".active")) setExpanded(true);
  // }, [curr_path, item.url]);
  if (items && items.length > 0) {
    const input_id = `${curr_id}-input`;
    return (
      <li className="sidebar-folder-parent flex flex-col gap-1">
        <input
          id={input_id}
          className="sidebar-folder-input"
          type="checkbox"
          defaultChecked={active}
          // Enable toggling of the checkbox using the Enter key
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              const input = e.target as HTMLInputElement;
              input.checked = !input.checked;
            }
          }}
        />
        <label
          htmlFor={input_id}
          style={padding}
          className="sidebar-item sidebar-folder-label"
        >
          <span className="indicator" style={{ "--color-tag": metadata?.color || 'rgb(var(--rgb-pwny-green)' } as React.CSSProperties} />
          <span className="folder-arrow">
            <ChevronRightRegular width="1em" height="1em" />
          </span>
          <span className="ml-2">
            {name}
          </span>
        </label>
        <ul className="sidebar-folder flex-col gap-1">
          {items.map((subitem, idx) => (
            <SidebarItem key={idx} id={`${curr_id}_${idx}`} item={subitem} depth={new_depth} expand_all={expand_all} />
          ))}
        </ul>
      </li>
    );
  } else if (url) {
    return (
      <li>
        <a
          href={url}
          style={padding}
          className={`sidebar-item ${active ? "active" : ""}`}
        >
          <span className="indicator" style={{ "--color-tag": metadata?.color || 'rgb(var(--rgb-pwny-green)' } as React.CSSProperties} />
          <span className="ml-4">
            {name}
          </span>
        </a>
      </li>
    );
  }
  return null;
}

export default Sidebar;
