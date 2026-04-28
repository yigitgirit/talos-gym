import Link from "next/link";
import { cn } from "@/lib/utils";

export function Logo({ className }: Readonly<{ className?: string }>) {
  return (
    <Link href="/" className={cn("flex items-center gap-2.5 hover:opacity-75 transition-opacity shrink-0 cursor-pointer", className)}>
      <div className="bg-linear-to-br from-blue-600 to-blue-700 text-white w-8 h-8 rounded-lg flex items-center justify-center font-heading font-bold text-lg">
        T
      </div>
      <span className="font-heading text-lg font-bold text-gray-900 hidden sm:inline">TalosGym</span>
    </Link>
  );
}
