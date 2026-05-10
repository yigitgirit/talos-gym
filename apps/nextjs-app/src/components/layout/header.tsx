"use client";

import { useState } from "react";
import { useAuth, useLogout } from "@/features/auth/hooks";
import { Logo } from "./logo";
import { DesktopNavigation } from "./desktop-nav";
import { DesktopActions } from "./desktop-actions";
import { MobileMenu } from "./mobile-menu";

export const MOCK_IS_MEMBER = false;

export const NAV_ITEMS = [
  { label: "Clubs", href: "/clubs" },
  { label: "Plans", href: "/membership-plans" },
  { label: "About", href: "/about" },
  { label: "Blog", href: "/blog" },
  { label: "Contact", href: "/contact" },
];

export const Header = () => {
  const [open, setOpen] = useState(false);
  const { user, isAuthenticated, isLoading } = useAuth();
  const { execute: logout, isPending: isLogoutPending } = useLogout();

  return (
      <header className="sticky top-0 z-50 w-full bg-background/95 backdrop-blur-md border-b border-border-subtle shadow-sm">
        {/* 1. Add "relative" here so the absolute nav aligns to this container */}
        <div className="container relative flex h-16 max-w-7xl items-center justify-between mx-auto px-4">

          <div className="flex items-center">
            <Logo />
          </div>

          {/* 2. Wrap DesktopNavigation in a div that forces it to the center */}
          <div className="hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            <DesktopNavigation items={NAV_ITEMS} />
          </div>

          <div className="flex items-center gap-4">
            <DesktopActions
                isLoading={isLoading}
                isAuthenticated={isAuthenticated}
                user={user}
                isLogoutPending={isLogoutPending}
                onLogout={logout}
                isMember={MOCK_IS_MEMBER}
            />

            <MobileMenu
                open={open}
                setOpen={setOpen}
                items={NAV_ITEMS}
                isLoading={isLoading}
                isAuthenticated={isAuthenticated}
                user={user}
                isLogoutPending={isLogoutPending}
                onLogout={logout}
                isMember={MOCK_IS_MEMBER}
            />
          </div>
        </div>
      </header>
  );
};