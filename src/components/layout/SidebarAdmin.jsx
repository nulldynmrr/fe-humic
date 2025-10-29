"use client";

import * as React from "react";
import {
  LayoutDashboard,
  Users,
  CalendarDays,
  Newspaper,
  Megaphone,
  Briefcase,
  Users2,
  MessageSquare,
  Handshake,
  Settings,
  HelpCircle,
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
          url: "admin/dashboard",
          icon: LayoutDashboard,
          isActive: true,
        },
        {
          title: "Users Admin",
          url: "/users-admin",
          icon: Users,
        },
      ],
    },
    {
      title: "Pages",
      items: [
        {
          title: "Agenda",
          url: "admin/agenda",
          icon: CalendarDays,
        },
        {
          title: "Berita",
          url: "admin/berita",
          icon: Newspaper,
        },
        {
          title: "Pengumuman",
          url: "admin/pengumuman",
          icon: Megaphone,
        },
        {
          title: "Internship Project",
          url: "admin/internship-project",
          icon: Briefcase,
        },
        {
          title: "Team Humic",
          url: "admin/team-humic",
          icon: Users2,
        },
        {
          title: "Testimoni",
          url: "admin/testimoni",
          icon: MessageSquare,
        },
        {
          title: "Partnership",
          url: "admin/partnership",
          icon: Handshake,
        },
      ],
    },
    {
      title: "Other",
      items: [
        {
          title: "Settings",
          url: "admin/settings",
          icon: Settings,
        },
        {
          title: "Help Center",
          url: "admin/help-center",
          icon: HelpCircle,
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
