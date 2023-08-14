import React, { useState } from "react";
import { Link } from "gatsby";
import { motion, LayoutGroup } from "framer-motion";
import { ChevronRightRegular } from "@fluentui/react-icons";
import _uniqueId from "lodash/uniqueId";

import "./styles.css";

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
  if (item.items) {
    const [id] = useState(_uniqueId("sidebar-dropdown-"));
    const [expanded, setExpanded] = useState(false);
    const new_depth = curr_depth + 1;
    return (
      <motion.label
        className="flex flex-col gap-1"
        transition={transition}
        layout="position"
      >
        <input
          type="checkbox"
          className="peer opacity-0 absolute"
          onChange={(e) => setExpanded(e.target.checked)}
        />
        <span
          style={padding}
          className="sidebar-item cursor-pointer peer-focus:" /* TODO: peer-checked: */
          // onClick={() => setExpanded(!expanded)}
        >
          <span className="indicator" />
          <motion.span
            className="flex flex-shrink-0 flex-grow-0"
            animate={{rotate: expanded ? 90 : 0}}
            transition={transition}
          >
            <ChevronRightRegular className="flex flex-shrink-0 flex-grow-0 checked:hidden" />
          </motion.span>
          <span className="ml-2">{item.name}</span>
        </span>
        <motion.span
          className="flex flex-col gap-1 overflow-hidden h-0 peer-checked:h-auto"
          animate={{
            height: expanded ? "auto" : 0,
            display: "flex",
            transitionEnd: {
              display: expanded ? "flex" : "none",
            }
          }}
          transition={transition}
          layout="position"
        >
          {item.items.map((subitem, idx) => (
            <SidebarItem key={idx} item={subitem} depth={new_depth} />
          ))}
        </motion.span>
      </motion.label>
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
          activeClassName="bg-surface-100 active"
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
