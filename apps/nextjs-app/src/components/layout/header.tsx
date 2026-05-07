"use client";

import { useState } from "react";
import { useAuth, useLogout } from "@/features/auth/hooks";
import { Logo } from "./logo";
import { DesktopNav } from "./desktop-nav";
import { DesktopActions } from "./desktop-actions";
import { MobileMenu } from "./mobile-menu";

// MOCK DATA: Replace with real user membership status check
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
      <div className="container flex h-16 max-w-7xl items-center justify-between mx-auto px-4">
        <Logo />

        <DesktopNav items={NAV_ITEMS} />

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
    </header>
  );
};
