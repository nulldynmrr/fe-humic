"use client";

import * as React from "react";
import {
  LayoutDashboard,
  Users,
  CalendarDays,
  Newspaper,
  Briefcase,
  Users2,
  MessageSquare,
  Handshake,
  Settings,
  Megaphone,
} from "lucide-react";

import { NavMain } from "@/components/nav-main";
import { NavProjects } from "@/components/nav-projects";
import { NavUser } from "@/components/nav-user";
import { TeamSwitcher } from "@/components/team-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
  SidebarProvider,
} from "@/components/ui/sidebar";

const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  teams: [
    {
      name: "Humic Centered",
      logo: "/assets/logo-humic-pesergi.png",
      plan: "Admin Dashboard",
    },
  ],
  navMain: [
    {
      title: "General",
      items: [
        {
          title: "Dashboard",
          url: "dashboard",
          icon: LayoutDashboard,
          isActive: true,
        },
        {
          title: "Users Admin",
          url: "users-admin",
          icon: Users,
        },
      ],
    },
    {
      title: "Pages",
      items: [
        {
          title: "Agenda",
          url: "agenda-overview",
          icon: CalendarDays,
        },
        {
          title: "Berita",
          url: "berita-overview",
          icon: Newspaper,
        },
        {
          title: "Pengumuman",
          url: "pengumuman-overview",
          icon: Megaphone,
        },
        {
          title: "Internship Project",
          url: "internship-project-overview",
          icon: Briefcase,
        },
        {
          title: "Staffs",
          url: "staffs-overview",
          icon: Users,
        },
        {
          title: "Intern",
          url: "teams-overview",
          icon: Users2,
        },
        {
          title: "Testimoni",
          url: "testimoni-overview",
          icon: MessageSquare,
        },
        {
          title: "Partnership",
          url: "partnership-overview",
          icon: Handshake,
        },
      ],
    },
    {
      title: "Other",
      items: [
        {
          title: "Banner",
          url: "banner-overview",
          icon: Megaphone,
        },
        {
          title: "Settings",
          url: "settings",
          icon: Settings,
        },
      ],
    },
  ],
};

export function AppSidebar({ ...props }) {
  return (
    <SidebarProvider>
      <Sidebar
        collapsible="icon"
        {...props}
        className="border-r   
        bg-white 
        dark:bg-[#1f1f1f] 
          border 
        border-black/10 
        dark:border-white/10  
          backdrop-blur-md"
      >
        <SidebarHeader className="px-4 pt-4">
          <TeamSwitcher teams={data.teams} />
        </SidebarHeader>

        <SidebarContent className="px-2">
          <NavMain items={data.navMain} />
        </SidebarContent>

        <SidebarFooter className="px-4 pb-4">
          <NavUser user={data.user} />
        </SidebarFooter>

        <SidebarRail />
      </Sidebar>
    </SidebarProvider>
  );
}
