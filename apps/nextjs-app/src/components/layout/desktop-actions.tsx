"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Settings, LogOut, User } from "lucide-react";
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
}: Readonly<{
  user: UserResponse;
  isLogoutPending: boolean;
  onLogout: () => void;
  isMember: boolean;
}>) {
  return (
    <div className="flex items-center gap-2">
      {!isMember && <BecomeTalosButton />}
      
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="gap-2 p-0 px-2 hover:bg-surface-hover cursor-pointer rounded-md ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring-subtle focus-visible:ring-offset-2">
            <Avatar size="sm" className="border border-border-subtle">
              <AvatarImage src="" alt={user.firstName} />
              <AvatarFallback className="bg-primary-subtle text-primary border border-primary-border flex items-center justify-center">
                <User className="h-4 w-4" />
              </AvatarFallback>
            </Avatar>
            <div className="hidden sm:flex flex-col items-start mr-1">
              <span className="text-sm font-medium text-foreground leading-none mb-1">
                {user.firstName} {user.lastName}
              </span>
              <span className="text-xs text-muted-foreground leading-none">{user.email}</span>
            </div>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56 mt-1 p-2" sideOffset={8}>
          <DropdownMenuGroup className="mb-2">
            <div className="px-2 py-1.5 flex flex-col gap-1">
              <span className="text-sm font-semibold text-foreground leading-none">
                {user.firstName} {user.lastName}
              </span>
              <span className="text-xs text-muted-foreground leading-none">
                {user.email}
              </span>
            </div>
          </DropdownMenuGroup>
          <DropdownMenuSeparator className="mb-1" />
          <DropdownMenuGroup>
            <DropdownMenuItem asChild className="cursor-pointer">
              <Link href="/account" className="w-full">
                <Settings className="mr-2 h-4 w-4" />
                <span>Profile Settings</span>
              </Link>
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator className="my-1" />
          <DropdownMenuItem
            onClick={onLogout}
            disabled={isLogoutPending}
            className="text-destructive cursor-pointer focus:bg-destructive-subtle focus:text-destructive"
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
      
      <div className="flex items-center gap-2">
        <Link href="/auth/login">
          <Button
            variant="ghost"
            size="sm"
            className="text-foreground hover:text-primary hover:bg-primary-subtle font-medium cursor-pointer uppercase text-xs tracking-wider"
          >
            Sign In
          </Button>
        </Link>
        <Link href="/auth/register">
          <Button
            variant="outline"
            size="sm"
            className="text-foreground/80 font-medium cursor-pointer uppercase text-xs tracking-wider"
          >
            Register
          </Button>
        </Link>
      </div>
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
}: Readonly<{
  isLoading: boolean;
  isAuthenticated: boolean;
  user: UserResponse | null;
  isLogoutPending: boolean;
  onLogout: () => void;
  isMember: boolean;
}>) {
  return (
    <div className="hidden lg:flex items-center gap-2.5">
      {isLoading ? (
        <div className="w-10 h-10 rounded-full bg-muted animate-pulse" />
      ) : isAuthenticated && user ? (
        <DesktopAuthenticatedNav user={user} isLogoutPending={isLogoutPending} onLogout={onLogout} isMember={isMember} />
      ) : (
        <DesktopUnauthenticatedNav />
      )}
    </div>
  );
}
