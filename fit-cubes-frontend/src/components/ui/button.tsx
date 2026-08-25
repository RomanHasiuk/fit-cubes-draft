import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils.ts"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-[5px] text-[16px] font-medium leading-none transition-all cursor-pointer touch-manipulation select-none disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-5 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:ring-2 focus-visible:ring-[#F59F0A]/50 active:scale-[0.98]",
  {
    variants: {
      variant: {
        default:
          "bg-[#F59F0A] text-white hover:bg-[#F59F0A]/90 shadow-md shadow-amber-500/20 active:bg-[#d98b04]",
        destructive:
          "bg-destructive text-white hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
        outline:
          "border border-border bg-transparent hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-[#16191E] border border-white/10 text-white hover:bg-[#1f232b] hover:border-white/20 active:bg-[#111317]",
        ghost:
          "hover:bg-white/5 hover:text-white",
        link: "text-[#F59F0A] underline-offset-4 hover:underline",
      },
      size: {
        default: "h-[44px] px-4 py-2",
        sm: "h-8 px-3 text-xs",
        lg: "h-[48px] px-6 text-base",
        icon: "size-[44px]",
        "icon-sm": "size-8",
        "icon-lg": "size-[48px]",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant = "default",
  size = "default",
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot : "button"

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
