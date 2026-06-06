import Link from "next/link";
import { cn } from "@Saints/ui/lib/utils";

interface SaintLinkProps {
  slug: string;
  children: React.ReactNode;
  className?: string;
}

export default function SaintLink({ slug, children, className }: SaintLinkProps) {
  return (
    <Link
      href={`/saints/${slug}`}
      className={cn(
        "font-medium text-amber-700 underline underline-offset-2 decoration-amber-400/60 hover:text-amber-600 hover:decoration-amber-500 transition-colors duration-200",
        className
      )}
    >
      {children}
    </Link>
  );
}