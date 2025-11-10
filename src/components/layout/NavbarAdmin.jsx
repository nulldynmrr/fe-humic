"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import {
  Search,
  Sun,
  Moon,
  Settings,
  Users,
  Package,
  LayoutDashboard,
  LogOut,
  User,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useTheme } from "next-themes";
import { usePathname, useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/Dropdown-menu";

export default function AdminNavbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const isDashboard = pathname === "/admin/dashboard";

  const menuItems = [
    { label: "Overview", href: "/admin/dashboard", icon: LayoutDashboard },
    { label: "Customers", href: "/admin/customers", icon: Users },
    { label: "Products", href: "/admin/products", icon: Package },
    { label: "Settings", href: "/admin/settings", icon: Settings },
  ];

  const handleLogout = async () => {
    try {
      await fetch("/api/logout", { method: "POST" });
      router.push("/login-administrator");
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  return (
    <header
      className={cn(
        "flex items-center justify-between px-4 md:px-6 py-3 bg-sidebar",
        "border-b border-gray-200 dark:border-white/10"
      )}
    >
      <div className="pl-2 md:pl-6 flex items-center gap-6">
        <Link href="/admin/dashboard" className="md:hidden flex space-x-2 items-center">
          <Image
            src="/assets/logo-humic-pesergi.png"
            alt="Logo"
            width={28}
            height={28}
            priority
          />
          <div>
            <h2 className="truncate text-medium">Humic Centered</h2>
            <p className="truncate text-xs text-muted-foreground">Admin Dashboard</p>
          </div>
        </Link>

        {isDashboard && (
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
        )}
      </div>

      <div className="flex items-center gap-3">
        {isDashboard && (
          <div className="relative hidden sm:block">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          </div>
        )}

        {mounted && (
          <Button variant="ghost" size="icon" onClick={() => setTheme(theme === "light" ? "dark" : "light")}>
            {theme === "light" ? <Moon className="h-[1.2rem] w-[1.2rem]" /> : <Sun className="h-[1.2rem] w-[1.2rem]" />}
          </Button>
        )}

        <Button variant="ghost" size="icon">
          <Settings className="h-[1.2rem] w-[1.2rem]" />
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Avatar className="cursor-pointer">
              <AvatarImage src="/avatars/admin.jpg" alt="@admin" />
              <AvatarFallback>A1</AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>

          <DropdownMenuContent className="w-48 mt-4" align="end">
            <DropdownMenuLabel>Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => router.push("/administrator/profile")}
              className="cursor-pointer capitalize text-black dark:text-white hover:bg-gray-100 dark:hover:bg-gray-200/20 transition-colors"
            >
              <User className="w-4 h-4 mr-2" />
              Edit Profile
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={handleLogout}
              className="cursor-pointer text-red-500 focus:text-red-600 capitalize transition-colors"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
