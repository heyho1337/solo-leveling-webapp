"use client";

import { DayPicker, type DayPickerProps } from "react-day-picker";
import { cn } from "@/lib/utils";

export type CalendarProps = DayPickerProps;

export function Calendar({ className, ...props }: CalendarProps) {
  return (
    <DayPicker
      mode="single"
      className={cn(
        "w-full rounded-2xl border border-white/10 bg-[#08101d] text-white",
        className
      )}
      {...props}
    />
  );
}
