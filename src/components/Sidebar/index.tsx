import React, { useEffect, useRef, useState } from "react";
import { Link } from "gatsby";
import { motion, LayoutGroup } from "framer-motion";
import { ChevronRightRegular } from "../Icons/fluentui";

import "./styles.css";

export const Sidebar = ({ root_items, expand_all }: SidebarProps) => {
  return (
    <LayoutGroup>
      <span className="flex flex-col gap-1 w-full select-none">
        {root_items.map((item, idx) => (
          <SidebarItem key={idx} item={item} expand_all={expand_all} />
        ))}
      </span>
    </LayoutGroup>
  )
};

export const SidebarItem = ({ item, depth, expand_all }: SidebarItemProps) => {
  const curr_depth = depth || 0;
  const padding = {paddingLeft: `${curr_depth}em`};
  const transition = {duration: 0.2, ease: "easeOut"};
  if (item.items && item.items.length > 0) {
    const [expanded, setExpanded] = useState(expand_all || false);
    const subitems_ref = useRef<HTMLSpanElement>(null);
    const new_depth = curr_depth + 1;
    useEffect(() => {
      if (subitems_ref.current?.querySelector(".active")) setExpanded(true);
    }, []);
    return (
      <motion.span
        className="flex flex-col gap-1 sidebar-folder-items"
        transition={transition}
        layout="position"
      >
        <button
          style={padding}
          className={`sidebar-item sidebar-folder ${expanded ? "" : "unexpanded"}`}
          onClick={() => setExpanded(!expanded)}
        >
          <span className="indicator" />
          <motion.span
            className="flex flex-shrink-0 flex-grow-0 rotate-90 ml-2"
            initial={false}
            animate={{rotate: expanded ? 90 : 0}}
            transition={transition}
          >
            <ChevronRightRegular width="1em" height="1em" />
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
            <SidebarItem key={idx} item={subitem} depth={new_depth} expand_all={expand_all} />
          ))}
        </motion.span>
      </motion.span>
    );
  } else if (item.url) {
    return (
      <motion.span
        transition={transition}
        layout="position"
      >
        <Link
          to={item.url}
          style={padding}
          className="sidebar-item"
          activeClassName="active"
        >
          <span className="indicator" />
          <span className="ml-4">{item.name}</span>
        </Link>
      </motion.span>
    );
  }
  return null;
}

export default Sidebar;
