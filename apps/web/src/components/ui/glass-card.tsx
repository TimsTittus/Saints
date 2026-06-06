import { cn } from "@Saints/ui/lib/utils";

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  hover?: boolean;
  padding?: "none" | "sm" | "md" | "lg";
  rounded?: "sm" | "md" | "lg" | "xl" | "2xl";
}

const paddingMap = {
  none: "",
  sm: "p-3",
  md: "p-5",
  lg: "p-8",
};

const roundedMap = {
  sm: "rounded-md",
  md: "rounded-lg",
  lg: "rounded-xl",
  xl: "rounded-2xl",
  "2xl": "rounded-3xl",
};

export default function GlassCard({
  children,
  className,
  hover = false,
  padding = "md",
  rounded = "xl",
  ...props
}: GlassCardProps) {
  return (
    <div
      className={cn(
        "glass",
        hover && "glass-hover",
        paddingMap[padding],
        roundedMap[rounded],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}