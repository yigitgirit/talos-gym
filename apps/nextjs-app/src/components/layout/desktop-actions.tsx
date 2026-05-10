"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Settings, LogOut, User, LayoutDashboard } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { UserResponse } from "@/lib/api/schema";
import { BecomeTalosButton } from "./become-talos-button";

function DesktopAuthenticatedNav({
                                   user,
                                   isLogoutPending,
                                   onLogout,
                                   isMember,
                                 }: {
  user: UserResponse;
  isLogoutPending: boolean;
  onLogout: () => void;
  isMember: boolean;
}) {
  const initials = `${user.firstName[0]}${user.lastName[0]}`.toUpperCase();

  const isStaff = user.roles.some(role => role === "ADMIN" || "STAFF");

  return (
      <div className="flex items-center gap-3">
        {/* 1. Show Dashboard link directly in nav for Staff */}
        {isStaff && (
            <Button variant="ghost" size="sm" asChild className="hidden xl:flex font-medium">
              <Link href="/dashboard">Dashboard</Link>
            </Button>
        )}

        {!isMember && !isStaff && <BecomeTalosButton />}

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-auto gap-2 p-1 px-2">
              <Avatar className="h-8 w-8">
                {/*<AvatarImage src={user.image ?? ""} alt={user.firstName} />*/}
                <AvatarFallback className="bg-primary/10 text-primary">
                  <User className="h-4 w-4" />
                </AvatarFallback>
              </Avatar>
              <span className="text-sm font-medium">{user.firstName} {user.lastName}</span>
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="w-56" sideOffset={8}>
            <div className="flex items-center gap-2 p-2">
              <Avatar className="h-8 w-8">
                <AvatarFallback>{initials}</AvatarFallback>
              </Avatar>
              <div className="flex flex-col min-w-0">
                <span className="truncate text-sm font-medium">{user.firstName} {user.lastName}</span>
                <span className="truncate text-xs text-muted-foreground">{user.email}</span>
              </div>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem asChild>
                <Link href="/account" className="w-full cursor-pointer">
                  <Settings className="mr-2 h-4 w-4" /> Profile
                </Link>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem
                onClick={onLogout}
                disabled={isLogoutPending}
                className="text-destructive focus:bg-destructive/10 focus:text-destructive cursor-pointer"
            >
              <LogOut className="mr-2 h-4 w-4" />
              <span>{isLogoutPending ? "Signing out..." : "Sign Out"}</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
  );
}

function DesktopUnauthenticatedNav() {
  return (
      <div className="flex items-center gap-2">
        <BecomeTalosButton />
        <Button variant="ghost" size="sm" asChild className="uppercase text-xs tracking-wider">
          <Link href="/auth/login">Sign In</Link>
        </Button>
        <Button variant="outline" size="sm" asChild className="uppercase text-xs tracking-wider">
          <Link href="/auth/register">Register</Link>
        </Button>
      </div>
  );
}

export function DesktopActions({
                                 isLoading,
                                 isAuthenticated,
                                 user,
                                 isLogoutPending,
                                 onLogout,
                                 isMember,
                               }: {
  isLoading: boolean;
  isAuthenticated: boolean;
  user: UserResponse | null;
  isLogoutPending: boolean;
  onLogout: () => void;
  isMember: boolean;
}) {
  return (
      <div className="hidden lg:flex items-center">
        {isLoading ? (
            <div className="h-8 w-8 rounded-full bg-muted animate-pulse" />
        ) : isAuthenticated && user ? (
            <DesktopAuthenticatedNav user={user} isLogoutPending={isLogoutPending} onLogout={onLogout} isMember={isMember} />
        ) : (
            <DesktopUnauthenticatedNav />
        )}
      </div>
  );
}