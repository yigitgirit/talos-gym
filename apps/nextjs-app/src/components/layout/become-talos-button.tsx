import Link from "next/link";
import { Button } from "@/components/ui/button";
import { BicepsFlexed } from "lucide-react";

export function BecomeTalosButton({
  className,
  buttonClassName,
  onClick,
}: Readonly<{
  className?: string;
  buttonClassName?: string;
  onClick?: () => void;
}>) {
  return (
    <Link href="/get-started" className={className} onClick={onClick}>
      <Button
        size="sm"
        variant="secondary"
        className={`gap-2 font-medium shadow-xs transition-all cursor-pointer text-primary hover:text-primary hover:bg-primary-subtle-hover bg-primary-subtle ${buttonClassName || ""}`}
      >
        <BicepsFlexed className="w-4 h-4" />
        Become a Talos
      </Button>
    </Link>
  );
}
