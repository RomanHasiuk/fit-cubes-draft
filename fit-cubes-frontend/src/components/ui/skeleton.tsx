import { cn } from "@/lib/utils.ts";

function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="skeleton"
      className={cn(
        "bg-primary/20 dark:bg-white/15 animate-pulse rounded-md border border-primary/10 dark:border-white/10",
        className
      )}
      {...props}
    />
  );
}

export { Skeleton };
