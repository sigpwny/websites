import { useState } from 'react';
import type { Placement } from '@floating-ui/react';
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from '@/components/Popover';
import { handleMenuKeyDown } from '@/components/Menu';
import { ChevronUpDownFilled } from '$/components/Icons/fluentui';

interface DropdownSelectProps {
  displayText: React.ReactNode;
  children?: React.ReactNode;
  contentRootClassName?: string;
  triggerClassName?: string;
  triggerStyle?: React.CSSProperties;
  onSelect?: (selected: string) => void;
  placement?: Placement;
  closeOnSelect?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  triggerAriaLabel?: string;
  triggerTitle?: string;
  showChevron?: boolean;
}

export default function DropdownSelect(props: DropdownSelectProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const open = props.open ?? internalOpen;
  const setOpen = (nextOpen: boolean) => {
    setInternalOpen(nextOpen);
    props.onOpenChange?.(nextOpen);
  };
  return (
    <Popover open={open} onOpenChange={setOpen} placement={props.placement ?? "bottom-start"}>
      <PopoverTrigger
        onClick={() => setOpen(!open)}
        className={`button flex flex-row gap-2 items-center justify-between bg-surface-100 hover:bg-surface-150 text-white w-full border border-surface-200 pr-1 ${open ? "ring-primary ring-2 ring-offset-2 ring-offset-surface-000" : ""} ${props.triggerClassName ?? ""}`}
        style={props.triggerStyle}
        aria-label={props.triggerAriaLabel}
        title={props.triggerTitle}
      >
        <span className="truncate">
          {props.displayText}
        </span>
        {props.showChevron !== false && <ChevronUpDownFilled />}
      </PopoverTrigger>
      <PopoverContent
        className={props.contentRootClassName}
        onKeyDown={handleMenuKeyDown}
        onClick={(event) => {
          if (props.closeOnSelect && (event.target as HTMLElement).closest('a, button')) {
            setOpen(false);
          }
        }}
      >
        {props.children}
      </PopoverContent>
    </Popover>
  );
};
