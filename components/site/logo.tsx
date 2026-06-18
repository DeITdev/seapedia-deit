import Link from "next/link";
import { Waves } from "lucide-react";

import { cn } from "@/lib/utils";

export function Logo({ className }: { className?: string }) {
  return (
    <Link
      href="/"
      className={cn("flex items-center gap-2 font-semibold", className)}
    >
      <span className="bg-primary text-primary-foreground flex size-8 items-center justify-center rounded-lg">
        <Waves className="size-5" />
      </span>
      <span className="text-lg tracking-tight">SEAPEDIA</span>
    </Link>
  );
}
