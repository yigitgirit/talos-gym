import Link from "next/link";
import { cn } from "@/lib/utils";

export function Logo({ className }: Readonly<{ className?: string }>) {
  return (
    <Link href="/" className={cn("flex items-center gap-2.5 hover:opacity-75 transition-opacity shrink-0 cursor-pointer", className)}>
      <div className="flex size-8 items-center justify-center rounded-lg bg-primary font-heading text-lg font-bold text-primary-foreground shadow-sm">
        T
      </div>
      <span className="hidden font-heading text-lg font-bold text-foreground sm:inline">TalosGym</span>
    </Link>
  );
}
