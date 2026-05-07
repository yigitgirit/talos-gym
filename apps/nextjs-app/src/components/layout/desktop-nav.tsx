"use client";

import Link from "next/link";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";

export function DesktopNav({ items }: Readonly<{ items: { label: string; href: string }[] }>) {
  return (
    <div className="hidden lg:flex absolute left-1/2 transform -translate-x-1/2">
      <NavigationMenu>
        <NavigationMenuList className="gap-2">
          {items.map((item) => (
            <NavigationMenuItem key={item.href}>
              <NavigationMenuLink asChild>
                <Link
                  href={item.href}
                  className="text-xs font-extrabold uppercase tracking-widest text-foreground hover:text-primary transition-colors cursor-pointer py-2 relative after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-full after:origin-bottom-left after:scale-x-0 after:bg-primary after:transition-transform hover:after:scale-x-100"
                >
                  {item.label}
                </Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
          ))}
        </NavigationMenuList>
      </NavigationMenu>
    </div>
  );
}
