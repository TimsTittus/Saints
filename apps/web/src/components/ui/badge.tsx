import { cn } from "@Saints/ui/lib/utils";
import type { Category } from "@/lib/constants";

const categoryStyles: Record<Category, string> = {
  Saint: "bg-amber-100/80 text-amber-800 border-amber-300/60",
  Blessed: "bg-blue-100/80 text-blue-800 border-blue-300/60",
  Venerable: "bg-purple-100/80 text-purple-800 border-purple-300/60",
  Martyr: "bg-red-100/80 text-red-800 border-red-300/60",
  Confessor: "bg-green-100/80 text-green-800 border-green-300/60",
  Doctor: "bg-indigo-100/80 text-indigo-800 border-indigo-300/60",
  Apostle: "bg-cyan-100/80 text-cyan-800 border-cyan-300/60",
  Evangelist: "bg-orange-100/80 text-orange-800 border-orange-300/60",
};

interface BadgeProps {
  label: string;
  variant?: Category | "default";
  className?: string;
}

export default function Badge({ label, variant = "default", className }: BadgeProps) {
  const style =
    variant !== "default"
      ? categoryStyles[variant as Category]
      : "bg-slate-100/80 text-slate-700 border-slate-300/60";

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium tracking-wide backdrop-blur-sm",
        style,
        className
      )}
    >
      {label}
    </span>
  );
}