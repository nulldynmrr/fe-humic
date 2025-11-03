"use client";
import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        default: "bg-primary text-white hover:bg-primary/90",
        secondary:
          "border border-primary text-primary bg-white hover:bg-primary/10",
        destructive:
          "bg-destructive text-white hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
        outline:
          "border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50",
        ghost:
          "hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-9 px-4 py-2 has-[>svg]:px-3",
        sm: "h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5",
        lg: "h-10 rounded-md px-6 has-[>svg]:px-4",
        icon: "size-9",
        "icon-sm": "size-8",
        "icon-lg": "size-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

function Button({
  className,
  variant,
  size,
  asChild = false,
  icon: Icon,
  children,
  ...props
}) {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    >
      {Icon && <Icon className="mr-2 size-4" />}
      {children}
    </Comp>
  );
}

const ButtonDefault = ({
  variant = "primary",
  text,
  icon,
  iconPosition = "left",
  onClick,
  fullWidth = false,
  maxWidth,
  loading = false,
  bgColor,
  textColor,
  equalSize,
}) => {
  const baseStyle =
    "flex items-center justify-center gap-2 px-4 py-2 rounded-sm text-sm font-medium transition-colors duration-200";

  const variants = {
    primary: "bg-primary text-white hover:bg-primary-800",
    secondary:
      "bg-white text-primary border border-primary-500 hover:bg-primary hover:text-white",
    disabled: "bg-neut-300 text-white cursor-not-allowed",
    outline: "border border-neut-300 text-neut-300 hover:bg-neut-100",
    round: "bg-primary text-white hover:bg-primary rounded-[20px] px-7 py-1",
    about:
      "bg-primary text-white hover:bg-primary rounded-l px-5 py-2 text-sm sm:px-6 sm:py-3 sm:text-base md:px-8 md:py-5 shadow-md cursor-pointer transition-all duration-200",
  };

  const widthStyle = fullWidth ? "w-full" : "";
  const customMaxWidth = maxWidth ? `max-w-[${maxWidth}]` : "";
  const isIconOnly = icon && !text;

  const customColorStyle = {
    ...(bgColor && { backgroundColor: bgColor }),
    ...(textColor && { color: textColor }),
    ...(variant === "secondary" && bgColor && { borderColor: bgColor }),
  };

  return (
    <button
      className={`${baseStyle} ${
        variants[variant]
      } ${widthStyle} ${customMaxWidth} 
      ${isIconOnly ? "p-3 text-xl" : ""} 
      ${equalSize ? "w-10 h-10 p-0" : ""}`}
      onClick={onClick}
      disabled={variant === "disabled" || loading}
      style={{
        maxWidth,
        ...customColorStyle,
      }}
    >
      {loading && (
        <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span>
      )}

      {!loading && icon && iconPosition === "left" && <span>{icon}</span>}
      {text && <span>{text}</span>}
      {!loading && icon && iconPosition === "right" && <span>{icon}</span>}
    </button>
  );
};

export default ButtonDefault;
export { Button, buttonVariants };
