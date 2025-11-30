"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuTrigger,
} from "@/components/ui/Dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import request from "@/utils/request";
import Cookies from "js-cookie";

export function NavUser() {
  const router = useRouter();
  const [admin, setAdmin] = useState({
    username: "Loading...",
    role: "",
    avatar: "",
  });
  const [loading, setLoading] = useState(true);

  const fetchCurrentAdmin = useCallback(async () => {
    try {
      setLoading(true);
      const token = Cookies.get("token");
      
      if (!token) {
        router.push("/login-administrator");
        return;
      }
      const response = await request.get("/admin");
      
      if (response.data) {
        const data = response.data;
        setAdmin({
          name:data.username,
          role: data.role,
          avatar: data.avatar || data.profileImage || data.photo || "",
        });
      }
    } catch (error) {
      console.error("Failed to fetch admin data:", error);
      
      if (error?.response?.status === 401 || error?.response?.status === 403) {
        Cookies.remove("token");
        router.push("/login-administrator");
      } else if (error?.response?.status === 404) {
        console.warn("Endpoint /admin not found, using localStorage fallback");
        const storedAdmin = localStorage.getItem("admin");
        
        if (storedAdmin) {
          const adminData = JSON.parse(storedAdmin);
          setAdmin({
            name: adminData.username,
            role: adminData.role,
            avatar: adminData.avatar || adminData.profileImage || "",
          });
        } else {
          router.push("/login-administrator");
        }
      } else {
        router.push("/login-administrator");
      }
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    fetchCurrentAdmin();
  }, [fetchCurrentAdmin]);

  const getInitials = (name) => {
    if (!name || name === "Loading...") return "...";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
              disabled={loading}
            >
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarImage src={admin.avatar} alt={admin.name} />
                <AvatarFallback className="rounded-lg">
                  {getInitials(admin.name)}
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{admin.name}</span>
                <span className="truncate text-xs text-muted-foreground">
                  {admin.role}
                </span>
              </div>
            </SidebarMenuButton>
          </DropdownMenuTrigger>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}