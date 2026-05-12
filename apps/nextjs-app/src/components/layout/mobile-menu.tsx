"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Menu, LogOut, Settings } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { UserResponse } from "@/lib/api/schema";
import { BecomeTalosButton } from "./become-talos-button";

function MobileAuthenticatedNav({
  user,
  isLogoutPending,
  onLogout,
  onClose,
  isMember,
}: Readonly<{
  user: UserResponse;
  isLogoutPending: boolean;
  onLogout: () => void;
  onClose: () => void;
  isMember: boolean;
}>) {
  return (
    <>
      <div className="px-4 py-3 bg-primary-subtle rounded-md mb-2">
        <div className="text-sm font-semibold text-foreground">
          {user.firstName} {user.lastName}
        </div>
        <div className="text-xs text-muted-foreground">
          {user.email}
        </div>
      </div>
      
      {!isMember && (
        <BecomeTalosButton
          className="w-full mb-2 block"
          buttonClassName="w-full"
          onClick={onClose}
        />
      )}

      <Link href="/profile" className="w-full">
        <Button
          variant="outline"
          className="w-full font-medium cursor-pointer justify-start"
          size="sm"
          onClick={onClose}
        >
          <Settings className="mr-2 h-4 w-4" />
          Profile Settings
        </Button>
      </Link>
      <Button
        variant="outline"
        className="w-full font-medium text-destructive hover:text-destructive hover:bg-destructive-subtle mt-2 cursor-pointer justify-start"
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

function MobileUnauthenticatedNav({ onClose }: Readonly<{ onClose: () => void }>) {
  return (
    <>
      <BecomeTalosButton
        className="w-full mb-4 block"
        buttonClassName="w-full"
        onClick={onClose}
      />
      
      <div className="flex flex-col gap-2">
        <Link href="/auth/login" className="w-full">
          <Button
            variant="outline"
            className="w-full font-medium cursor-pointer uppercase text-xs tracking-wider"
            size="sm"
            onClick={onClose}
          >
            Sign In
          </Button>
        </Link>
        <Link href="/auth/register" className="w-full">
          <Button
            variant="outline"
            className="w-full font-medium bg-secondary hover:bg-secondary-hover cursor-pointer uppercase text-xs tracking-wider"
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

export function MobileMenu({
  open,
  setOpen,
  items,
  isLoading,
  isAuthenticated,
  user,
  isLogoutPending,
  onLogout,
  isMember,
}: Readonly<{
  open: boolean;
  setOpen: (open: boolean) => void;
  items: { label: string; href: string }[];
  isLoading: boolean;
  isAuthenticated: boolean;
  user: UserResponse | null;
  isLogoutPending: boolean;
  onLogout: () => void;
  isMember: boolean;
}>) {
  return (
    <div className="lg:hidden flex items-center gap-2">
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button size="icon" variant="ghost" className="text-muted-foreground cursor-pointer">
            <Menu className="w-5 h-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="right" className="w-64 p-6">
          <VisuallyHidden>
            <SheetHeader>
              <SheetTitle>Mobile Navigation Menu</SheetTitle>
            </SheetHeader>
          </VisuallyHidden>
          <div className="flex flex-col gap-1 mt-8">
            {items.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="px-4 py-3 text-xs font-bold uppercase tracking-wider text-muted-foreground hover:text-foreground relative after:absolute after:bottom-2 after:left-4 after:h-[2px] after:w-[calc(100%-2rem)] after:origin-bottom-left after:scale-x-0 after:bg-primary after:transition-transform hover:after:scale-x-100 rounded-md transition-all cursor-pointer"
                onClick={() => setOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <div className="flex flex-col gap-2 mt-6 pt-6 border-t border-border">
              {isLoading ? (
                <div className="px-4 py-3 bg-muted rounded-md h-12 animate-pulse" />
              ) : isAuthenticated && user ? (
                <MobileAuthenticatedNav
                  user={user}
                  isLogoutPending={isLogoutPending}
                  onLogout={onLogout}
                  onClose={() => setOpen(false)}
                  isMember={isMember}
                />
              ) : (
                <MobileUnauthenticatedNav onClose={() => setOpen(false)} />
              )}
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
