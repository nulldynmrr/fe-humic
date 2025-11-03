"use client";

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import Link from "next/link";

export function NavMain({ items }) {
  return (
    <>
      {items.map((group) => (
        <SidebarGroup key={group.title}>
          <SidebarGroupLabel>{group.title}</SidebarGroupLabel>

          <SidebarMenu>
            {group.items.map((subItem) => (
              <SidebarMenuItem key={subItem.title}>
                <SidebarMenuButton
                  asChild
                  tooltip={subItem.title}
                  className="
                    text-[15px] font-medium
                    text-gray-700 hover:text-gray-900
                    dark:text-gray-300 dark:hover:text-white
                    transition-colors
                  "
                >
                  <Link href={subItem.url} className="flex items-center gap-2">
                    {subItem.icon && (
                      <subItem.icon
                        className="
                        h-4 w-4
                        text-gray-500 dark:text-gray-400
                        transition-colors
                      "
                      />
                    )}
                    <span>{subItem.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      ))}
    </>
  );
}
