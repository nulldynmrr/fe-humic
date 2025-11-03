"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Search,
  Sun,
  Moon,
  Settings,
  Users,
  Package,
  LayoutDashboard,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useTheme } from "next-themes";
import { usePathname } from "next/navigation";

export default function AdminNavbar() {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const [search, setSearch] = useState("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const isDashboard = pathname === "/admin/dashboard";

  const menuItems = [
    { label: "Overview", href: "/admin/dashboard", icon: LayoutDashboard },
    { label: "Customers", href: "/admin/customers", icon: Users },
    { label: "Products", href: "/admin/products", icon: Package },
    { label: "Settings", href: "/admin/settings", icon: Settings },
  ];

  return (
    <header
      className={cn(
        "flex items-center justify-between px-4 md:px-6 py-3 bg-sidebar",
        "border-b border-gray-200 dark:border-white/10"
      )}
    >
      <div className="pl-2 md:pl-6 flex items-center gap-6">
        <Link
          href="/admin/dashboard"
          className="md:hidden flex space-x-2 items-center"
        >
          <Image
            src="/assets/logo-humic-pesergi.png"
            alt="Logo"
            width={28}
            height={28}
            priority
          />
          <div>
            <h2 className="truncate text-medium">Humic Centered</h2>
            <p className="truncate text-xs text-muted-foreground">
              Admin Dashboard
            </p>
          </div>
        </Link>

        {isDashboard ? (
          <nav className="hidden md:flex items-center gap-6">
            {menuItems.map(({ label, href }) => {
              const isActive = pathname === href;
              return (
                <Link
                  key={label}
                  href={href}
                  className={cn(
                    "text-sm font-medium transition-colors",
                    isActive
                      ? "text-black dark:text-white"
                      : "text-[#62748E] hover:text-foreground"
                  )}
                >
                  {label}
                </Link>
              );
            })}
          </nav>
        ) : (
          <div className="ml-6 md:ml-0 relative hidden sm:block w-full md:w-[280px] lg:w-[400px]">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-8"
            />
          </div>
        )}
      </div>

      <div className="flex items-center gap-3">
        {isDashboard && (
          <div className="relative hidden sm:block">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-8 w-44 sm:w-56"
            />
          </div>
        )}

        {mounted && (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
          >
            {theme === "light" ? (
              <Moon className="h-[1.2rem] w-[1.2rem]" />
            ) : (
              <Sun className="h-[1.2rem] w-[1.2rem]" />
            )}
          </Button>
        )}

        <Button variant="ghost" size="icon">
          <Settings className="h-[1.2rem] w-[1.2rem]" />
        </Button>

        <Avatar className="cursor-pointer">
          <AvatarImage src="/avatars/admin.jpg" alt="@admin" />
          <AvatarFallback>A1</AvatarFallback>
        </Avatar>
      </div>
    </header>
  );
}
