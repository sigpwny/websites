import { useState } from 'react';
import type { Placement } from '@floating-ui/react';
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from '@/components/Popover';
import { ChevronUpDownFilled } from '$/components/Icons/fluentui';

interface DropdownSelectProps {
  displayText: string;
  children?: React.ReactNode;
  contentRootClassName?: string;
  onSelect?: (selected: string) => void;
  placement?: Placement;
}

export default function DropdownSelect(props: DropdownSelectProps) {
  const [open, setOpen] = useState(false);
  return (
    <Popover open={open} onOpenChange={setOpen} placement={props.placement ?? "bottom-start"}>
      <PopoverTrigger
        onClick={() => setOpen(!open)}
        className={`button flex flex-row gap-2 items-center justify-between bg-surface-100 hover:bg-surface-150 text-white w-full border border-surface-200 pr-1 ${open ? "ring-primary ring-2 ring-offset-2 ring-offset-surface-000" : ""}`}
      >
        <span className="truncate">
          {props.displayText}
        </span>
        <ChevronUpDownFilled />
      </PopoverTrigger>
      <PopoverContent className={props.contentRootClassName}>
        {props.children}
      </PopoverContent>
    </Popover>
  );
};