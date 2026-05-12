import Link from "next/link";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";

interface NavItem {
  label: string;
  href: string;
}

interface DesktopNavigationProps {
  items: NavItem[];
}

export function DesktopNavigation({ items }: DesktopNavigationProps) {
  return (
      <NavigationMenu>
        <NavigationMenuList>
          {items.map((item) => (
              <NavigationMenuItem key={item.label}>
                <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
                <Link href={item.href} passHref>
                    {item.label}
                </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
          ))}
        </NavigationMenuList>
      </NavigationMenu>
  );
}