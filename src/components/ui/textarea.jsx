import * as React from "react";
import { cn } from "@/lib/utils";

function Textarea({ className, ...props }) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "placeholder:text-muted-foreground selection:bg-white selection:text-white-foreground bg-white dark:bg-[#101010]",
        "dark:bg-input/30 border border-black/10 dark:border-white/10",
        "w-full min-w-0 rounded-md bg-transparent px-3 py-2 text-base shadow-xs",
        "transition-[color,box-shadow] outline-none",
        "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
        "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
        "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
        "min-h-24 resize-y",

        className
      )}
      {...props}
    />
  );
}

export { Textarea };
