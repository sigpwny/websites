import { useState } from 'react';
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from '@/components/Popover';


export default function Persona(props: any) {
  const [open, setOpen] = useState(false);
  return (
    <Popover open={open} onOpenChange={setOpen} placement={props.placement}>
      <div className="flex flex-row gap-2 items-center">
        <div className="flex shrink-0 grow-0">
          <PopoverTrigger
            onClick={() => setOpen(!open)}
            className={`cursor-pointer rounded-full ring-2 ring-transparent ring-offset-0 size-8 hover:ring-primary active:ring-primary focus:outline-none focus:ring-white ${open ? "ring-primary" : ""}`}
          >
            {props.avatar}
          </PopoverTrigger>
        </div>
        <div className="flex flex-row items-center">
          {props.visibleInfo}
        </div>
      </div>
      <div className="absolute top-full mt-2 left-0">
        <PopoverContent className="">
          {props.hiddenInfo}
        </PopoverContent>
      </div>
    </Popover>
  )
}