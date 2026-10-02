import { Button as ButtonPrimitive } from "@base-ui/react/button";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "cn";

const buttonVariants = cva(
  "group/button inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-lg border border-transparent bg-clip-padding px-4 text-sm font-medium whitespace-nowrap transition-[transform,box-shadow,background-color,color] outline-none select-none focus-visible:ring-2 focus-visible:ring-ring/60 active:not-aria-[haspopup]:translate-y-px disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-2 aria-invalid:ring-destructive/20 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground shadow-soft hover:bg-primary/95 hover:shadow-raised active:shadow-inset",
        outline: "border-border bg-card shadow-soft hover:bg-muted hover:text-foreground hover:shadow-raised active:shadow-inset aria-expanded:bg-muted",
        secondary: "bg-secondary text-secondary-foreground shadow-soft hover:bg-secondary/80 hover:shadow-raised active:shadow-inset aria-expanded:bg-secondary",
        ghost: "hover:bg-muted hover:text-foreground aria-expanded:bg-muted",
        destructive: "bg-destructive/10 text-destructive hover:bg-destructive/15 focus-visible:ring-destructive/30",
        link: "px-1 text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "min-h-11",
        xs: "min-h-11 px-3 text-xs [&_svg:not([class*='size-'])]:size-3",
        sm: "min-h-11 px-3 text-sm",
        lg: "min-h-12 px-5",
        icon: "size-11 px-0",
        "icon-xs": "size-11 px-0 [&_svg:not([class*='size-'])]:size-3",
        "icon-sm": "size-11 px-0",
        "icon-lg": "size-11 px-0",
      },
    },
    defaultVariants: { variant: "default", size: "default" },
  },
);

function Button({ className, variant = "default", size = "default", ...props }: ButtonPrimitive.Props & VariantProps<typeof buttonVariants>) {
  return <ButtonPrimitive data-slot="button" className={cn(buttonVariants({ variant, size, className }))} {...props} />;
}

export { Button, buttonVariants };
