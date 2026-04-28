"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import {Menu, LogOut, Settings, BicepsFlexed, User} from "lucide-react";
import { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useAuth, useLogout } from "@/features/auth/hooks";
import {UserResponse} from "@/lib/api/schema";
import { Logo } from "./logo";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

// MOCK DATA: Replace with real user membership status check
const MOCK_IS_MEMBER = false;

// Shared "Become a Talos" Nav Item for both views
function BecomeTalosNavItem() {
  return (
    <Link href="/get-started" className="flex items-center">
      <Button
        size="sm"
        variant="secondary"
        className="gap-2 font-medium shadow-xs transition-all cursor-pointer text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 bg-indigo-50/50"
      >
        <BicepsFlexed className="w-4 h-4" />
        Become a Talos
      </Button>
    </Link>
  );
}

// Desktop Authenticated View
function DesktopAuthenticatedNav({ user, isLogoutPending, onLogout, isMember }: Readonly<{
  user: UserResponse;
  isLogoutPending: boolean;
  onLogout: () => void;
  isMember: boolean;
}>) {
  return (
    <div className="flex items-center gap-2">
      {!isMember && <BecomeTalosNavItem />}
      
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="gap-2 p-0 px-2 hover:bg-transparent cursor-pointer rounded-md ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
            <Avatar size="sm" className="border border-border/50">
              <AvatarImage src="" alt={user.firstName} />
              <AvatarFallback className="bg-blue-50 text-blue-600 border border-blue-100 flex items-center justify-center">
                <User className="h-4 w-4" />
              </AvatarFallback>
            </Avatar>
            <div className="hidden sm:flex flex-col items-start mr-1">
              <span className="text-sm font-medium text-gray-900 leading-none mb-1">
                {user.firstName} {user.lastName}
              </span>
              <span className="text-xs text-gray-500 leading-none">{user.email}</span>
            </div>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56 mt-1 p-2" sideOffset={8}>
          <DropdownMenuGroup className="mb-2">
            <div className="px-2 py-1.5 flex flex-col gap-1">
              <span className="text-sm font-semibold text-gray-900 leading-none">
                {user.firstName} {user.lastName}
              </span>
              <span className="text-xs text-gray-500 leading-none">
                {user.email}
              </span>
            </div>
          </DropdownMenuGroup>
          <DropdownMenuSeparator className="mb-1" />
          <DropdownMenuGroup>
            <DropdownMenuItem asChild className="cursor-pointer">
              <Link href="/profile" className="w-full">
                <Settings className="mr-2 h-4 w-4" />
                <span>Profile Settings</span>
              </Link>
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator className="my-1" />
          <DropdownMenuItem
            onClick={onLogout}
            disabled={isLogoutPending}
            className="text-red-600 cursor-pointer focus:bg-red-50 focus:text-red-600"
          >
            <LogOut className="mr-2 h-4 w-4" />
            <span>{isLogoutPending ? "Signing out..." : "Sign Out"}</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

// Desktop Unauthenticated View
function DesktopUnauthenticatedNav() {
  return (
    <div className="flex items-center gap-2">
      <BecomeTalosNavItem />
      
      <div className="flex items-center gap-2">
        <Link href="/auth/login">
          <Button
            variant="ghost"
            size="sm"
            className="text-gray-700 hover:text-blue-600 hover:bg-blue-50/50 font-medium cursor-pointer"
          >
            Sign In
          </Button>
        </Link>
        <Link href="/auth/register">
          <Button
            variant="outline"
            size="sm"
            className="text-gray-700 font-medium cursor-pointer"
          >
            Register
          </Button>
        </Link>
      </div>
    </div>
  );
}

// Desktop Right Actions
function DesktopRightActions({ isLoading, isAuthenticated, user, isLogoutPending, onLogout, isMember }: Readonly<{
  isLoading: boolean;
  isAuthenticated: boolean;
  user: UserResponse | null;
  isLogoutPending: boolean;
  onLogout: () => void;
  isMember: boolean;
}>) {
  if (isLoading) {
    return <div className="w-10 h-10 rounded-full bg-gray-200 animate-pulse" />;
  }

  if (isAuthenticated && user) {
    return <DesktopAuthenticatedNav user={user} isLogoutPending={isLogoutPending} onLogout={onLogout} isMember={isMember} />;
  }

  return <DesktopUnauthenticatedNav />;
}

// Mobile Authenticated View
function MobileAuthenticatedNav({ user, isLogoutPending, onLogout, onClose, isMember }: Readonly<{
  user: UserResponse;
  isLogoutPending: boolean;
  onLogout: () => void;
  onClose: () => void;
  isMember: boolean;
}>) {
  return (
    <>
      <div className="px-4 py-3 bg-blue-50 rounded-md mb-2">
        <div className="text-sm font-semibold text-gray-900">
          {user.firstName} {user.lastName}
        </div>
        <div className="text-xs text-gray-500">
          {user.email}
        </div>
      </div>
      
      {!isMember && (
        <Link href="/get-started" className="w-full mb-2 block">
          <Button
            className="w-full gap-2 font-medium cursor-pointer text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 bg-indigo-50/50"
            size="sm"
            variant="secondary"
            onClick={onClose}
          >
            <BicepsFlexed className="w-4 h-4" />
            Become a Talos
          </Button>
        </Link>
      )}

      <Link href="/profile" className="w-full">
        <Button
          variant="outline"
          className="w-full font-medium cursor-pointer"
          size="sm"
          onClick={onClose}
        >
          <Settings className="mr-2 h-4 w-4" />
          Profile Settings
        </Button>
      </Link>
      <Button
        variant="outline"
        className="w-full font-medium text-red-600 hover:text-red-600 hover:bg-red-50 mt-2 cursor-pointer"
        size="sm"
        disabled={isLogoutPending}
        onClick={() => {
          onLogout();
          onClose();
        }}
      >
        <LogOut className="mr-2 h-4 w-4" />
        {isLogoutPending ? "Signing out..." : "Sign Out"}
      </Button>
    </>
  );
}

// Mobile Unauthenticated View
function MobileUnauthenticatedNav({ onClose }: Readonly<{ onClose: () => void }>) {
  return (
    <>
      <Link href="/get-started" className="w-full mb-4 block">
        <Button
          className="w-full gap-2 font-medium shadow-xs cursor-pointer text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 bg-indigo-50/50"
          size="sm"
          variant="secondary"
          onClick={onClose}
        >
          <BicepsFlexed className="w-4 h-4" />
          Become a Talos
        </Button>
      </Link>
      
      <div className="grid grid-cols-2 gap-2">
        <Link href="/auth/login" className="w-full">
          <Button
            variant="outline"
            className="w-full font-medium cursor-pointer"
            size="sm"
            onClick={onClose}
          >
            Sign In
          </Button>
        </Link>
        <Link href="/auth/register" className="w-full">
          <Button
            variant="outline"
            className="w-full font-medium bg-gray-50 hover:bg-gray-100 cursor-pointer"
            size="sm"
            onClick={onClose}
          >
            Register
          </Button>
        </Link>
      </div>
    </>
  );
}

// Mobile Authentication Section
function MobileAuthSection({ isLoading, isAuthenticated, user, isLogoutPending, onLogout, onClose, isMember }: Readonly<{
  isLoading: boolean;
  isAuthenticated: boolean;
  user: UserResponse | null;
  isLogoutPending: boolean;
  onLogout: () => void;
  onClose: () => void;
  isMember: boolean;
}>) {
  if (isLoading) {
    return <div className="px-4 py-3 bg-gray-100 rounded-md h-12 animate-pulse" />;
  }

  if (isAuthenticated && user) {
    return <MobileAuthenticatedNav user={user} isLogoutPending={isLogoutPending} onLogout={onLogout} onClose={onClose} isMember={isMember} />;
  }

  return <MobileUnauthenticatedNav onClose={onClose} />;
}

export const Header = () => {
  const [open, setOpen] = useState(false);
  const { user, isAuthenticated, isLoading } = useAuth();
  const { execute: logout, isPending: isLogoutPending } = useLogout();

  const handleLogout = () => {
    logout();
  };

  const navItems = [
    { label: "Clubs", href: "/clubs" },
    { label: "Plans", href: "/membership-plans" },
    { label: "About", href: "/about" },
    { label: "Blog", href: "/blog" },
    { label: "Contact", href: "/contact" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm">
      <div className="container flex h-16 max-w-7xl items-center justify-between mx-auto px-4">
        <Logo />

        {/* Desktop Navigation - Centered */}
        <div className="hidden lg:flex absolute left-1/2 transform -translate-x-1/2">
          <NavigationMenu>
            <NavigationMenuList>
              {navItems.map((item) => (
                <NavigationMenuItem key={item.href}>
                  <NavigationMenuLink className={navigationMenuTriggerStyle()} asChild>
                    <Link href={item.href}>{item.label}</Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        {/* Right Actions - Desktop */}
        <div className="hidden lg:flex items-center gap-2.5">
          <DesktopRightActions
            isLoading={isLoading}
            isAuthenticated={isAuthenticated}
            user={user}
            isLogoutPending={isLogoutPending}
            onLogout={handleLogout}
            isMember={MOCK_IS_MEMBER}
          />
        </div>

        {/* Mobile Navigation */}
        <div className="lg:hidden flex items-center gap-2">
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button size="icon" variant="ghost" className="text-gray-700 cursor-pointer">
                <Menu className="w-5 h-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-64">
              {/* ACCESSIBILITY FIX: Adding a VisuallyHidden DialogTitle for Screen Readers */}
              <VisuallyHidden>
                <SheetHeader>
                  <SheetTitle>Mobile Navigation Menu</SheetTitle>
                </SheetHeader>
              </VisuallyHidden>
              <div className="flex flex-col gap-1 mt-8">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="px-4 py-3 text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-all cursor-pointer"
                    onClick={() => setOpen(false)}
                  >
                    {item.label}
                  </Link>
                ))}
                <div className="flex flex-col gap-2 mt-6 pt-6 border-t border-gray-200">
                  <MobileAuthSection
                    isLoading={isLoading}
                    isAuthenticated={isAuthenticated}
                    user={user}
                    isLogoutPending={isLogoutPending}
                    onLogout={handleLogout}
                    onClose={() => setOpen(false)}
                    isMember={MOCK_IS_MEMBER}
                  />
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};
