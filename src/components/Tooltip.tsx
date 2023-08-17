import React from "react";
import { Tooltip as ReactTooltip } from "react-tooltip";

import { ProfileCard } from "./Profile";

interface Props {
  [key:string]: any
}

export const Tooltip = (props: Props) => (
  <ReactTooltip
    anchorSelect=".tooltip-select"
    className="!p-2 !transition-none !bg-surface-250 !shadow-2xl !rounded-xl"
    border={"2px solid var(--color-surface-300"}
    opacity={1}
    clickable
    {...props}
  />
)

Tooltip.Profile = (props: Props) => (
  <ReactTooltip
    anchorSelect=".profile-tooltip-select"
    className="!p-0 !transition-none !bg-transparent !shadow-2xl"
    opacity={1}
    place={"top-end"}
    clickable
    noArrow
    render={({ content }) => {
      if (!content) return null
      const profile = JSON.parse(content)
      return (
        <ProfileCard profile={profile} />
      )
    }}
    {...props}
  />
)

Tooltip.Link = (props: Props) => (
  <ReactTooltip
    anchorSelect=".link-tooltip-select"
    className="!px-3 !py-2 !transition-none !bg-surface-250 !shadow-2xl !rounded-xl"
    border={"2px solid var(--color-surface-300"}
    opacity={1}
    {...props}
  />
)

Tooltip.Day = (props: Props) => (
  <ReactTooltip
    anchorSelect=".day-tooltip-select"
    className="!px-2 !py-0 !transition-none !bg-surface-250 !shadow-2xl !rounded-xl font-mono hidden md:block"
    border={"2px solid var(--color-surface-300"}
    opacity={1}
    place={"left"}
    {...props}
  />
)

export default Tooltip;