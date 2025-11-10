"use client";

import { Button } from "@/components/ui/Button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/Dropdown-menu";
import { MoreHorizontal } from "lucide-react";

export default function TableAction({ actions = [], align = "end" }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align={align}
        className="bg-white dark:bg-[#1f1f1f] border border-black/10 dark:border-white/10 backdrop-blur-md"
      >
        {actions.map((action, i) => (
          <DropdownMenuItem
            key={i}
            onClick={action.onClick}
            className={action.danger ? "text-red-600" : ""}
          >
            {action.icon && <span className="mr-2">{action.icon}</span>}
            {action.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
