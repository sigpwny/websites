import React, { useRef, useState } from "react";
import { Link } from "gatsby";
import { motion, LayoutGroup } from "framer-motion";
import { ChevronRightRegular } from "@fluentui/react-icons";

import "./styles.css";

// TODO: Add option to expand all items by default
export const Sidebar = ({ root_items }: SidebarProps) => {
  return (
    <LayoutGroup>
      <span className="flex flex-col gap-1 w-full select-none">
        {root_items.map((item, idx) => (
          <SidebarItem key={idx} item={item} />
        ))}
      </span>
    </LayoutGroup>
  )
};

export const SidebarItem = ({ item, depth }: {item: SidebarItem, depth?: number}) => {
  const curr_depth = depth || 0;
  const padding = {paddingLeft: `${curr_depth}em`};
  const transition = {duration: 0.2, ease: "easeOut"};
  if (item.items && item.items.length > 0) {
    const [expanded, setExpanded] = useState(false);
    const subitems_ref = useRef<HTMLSpanElement>(null);
    const new_depth = curr_depth + 1;
    return (
      <motion.span
        className="flex flex-col gap-1"
        transition={transition}
        layout="position"
      >
        <button
          style={padding}
          className={`sidebar-item cursor-pointer ${
            !expanded && subitems_ref?.current?.querySelector(".active") ? "active" : ""
          }`}
          onClick={() => setExpanded(!expanded)}
        >
          <span className="indicator" />
          <motion.span
            className="flex flex-shrink-0 flex-grow-0 rotate-90"
            initial={false}
            animate={{rotate: expanded ? 90 : 0}}
            transition={transition}
          >
            <ChevronRightRegular className="flex flex-shrink-0 flex-grow-0 checked:hidden" />
          </motion.span>
          <span className="ml-2">{item.name}</span>
        </button>
        <motion.span
          ref={subitems_ref}
          className="flex flex-col gap-1"
          initial={false}
          animate={{
            height: expanded ? "auto" : 0,
            display: "flex",
            overflowY: "hidden",
            transitionEnd: {
              display: expanded ? "flex" : "none",
              overflowY: expanded ? "visible" : "hidden",
            }
          }}
          transition={transition}
          layout="position"
        >
          {item.items.map((subitem, idx) => (
            <SidebarItem key={idx} item={subitem} depth={new_depth} />
          ))}
        </motion.span>
      </motion.span>
    );
  } else if (item.link) {
    return (
      <motion.span
        transition={transition}
        layout="position"
      >
        <Link
          to={item.link}
          style={padding}
          className="sidebar-item"
          activeClassName="active"
        >
          <span className="indicator" />
          <span className="ml-2">{item.name}</span>
        </Link>
      </motion.span>
    );
  }
  return null;
}

export default Sidebar;
