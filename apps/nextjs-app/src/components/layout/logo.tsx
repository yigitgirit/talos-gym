import Link from "next/link";
import { cn } from "@/lib/utils";
import {SportShoe} from "lucide-react";

export function Logo({ className }: Readonly<{ className?: string }>) {
  return (
    <Link href="/" className={cn("flex items-center gap-2.5 shrink-0 cursor-pointer", className)}>
      <SportShoe className="h-6 w-6" />
      <span className="hidden text-base font-semibold text-foreground sm:inline">TalosGym</span>
    </Link>
  );
}
