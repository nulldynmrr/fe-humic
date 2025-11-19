"use client";

import * as React from "react";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { CalendarIcon } from "lucide-react";

export function DatePicker({
  value,
  onChange,
  placeholder = "Pilih tanggal...",
  className,
  disabled,
}) {
  const [open, setOpen] = React.useState(false);

  const handleSelect = (date) => {
    onChange(date);
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          disabled={disabled}
          className={cn(
            "mt-2 h-9 w-full justify-start text-left font-normal",
            "bg-transparent border border-black/10 dark:border-white/10",

            "hover:bg-black/10 dark:hover:bg-white/10",
            "active:bg-black/20 dark:active:bg-white/20",

            "focus-visible:ring-0 focus-visible:ring-offset-0",

            "disabled:cursor-not-allowed disabled:opacity-50",
            !value && "text-muted-foreground",
            className
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {value ? format(value, "PPP") : <span>{placeholder}</span>}
        </Button>
      </PopoverTrigger>

      <PopoverContent
        className="w-auto p-0 bg-white dark:bg-[#1f1f1f] border border-black/10 dark:border-white/10"
        align="start"
      >
        <Calendar
          mode="single"
          selected={value}
          onSelect={handleSelect}
          initialFocus
          className="
            [&_.react-day-picker__day--selected]:bg-gray-100
            [&_.react-day-picker__day--selected]:text-gray-900
            [&_.react-day-picker__day--today]:bg-transparent
          "
        />
      </PopoverContent>
    </Popover>
  );
}
