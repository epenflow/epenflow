import { cn } from "cn";
import { cva, type VariantProps } from "class-variance-authority";
import { mergeProps, useRender } from "@base-ui/react";

const Root = ({ render, className, ...props }: useRender.ComponentProps<"nav">) =>
  useRender({
    render,
    defaultTagName: "nav",
    props: mergeProps<"nav">(
      {
        className: cn(
          "pointer-events-none fixed inset-x-0 bottom-2 z-[calc(infinity)] flex justify-center",
          className,
        ),
      },
      props,
    ),
  });

const Group = ({ render, className, ...props }: useRender.ComponentProps<"ul">) =>
  useRender({
    render,
    defaultTagName: "ul",
    props: mergeProps<"ul">(
      {
        role: "toolbar",
        className: cn(
          "pointer-events-auto flex items-end gap-2 rounded-xl p-2",
          "bg-card border-border border",
          className,
        ),
      },
      props,
    ),
  });

const Item = ({ render, className, ...props }: useRender.ComponentProps<"li">) =>
  useRender({
    render,
    defaultTagName: "li",
    props: mergeProps<"li">(
      {
        className: cn("relative flex shrink-0 items-end", "size-(--size,48px)", className),
      },
      props,
    ),
  });

const Button = ({ render, className, ...props }: useRender.ComponentProps<"button">) =>
  useRender({
    render,
    defaultTagName: "button",
    props: mergeProps<"button">(
      {
        className: cn(
          "absolute bottom-0 flex aspect-square w-full origin-bottom items-center justify-center rounded-xl",
          "bg-card border-border border",
          className,
        ),
      },
      props,
    ),
  });

const badgeVariants = cva("absolute -bottom-1.5 left-1/2 size-1 -translate-1/2 rounded-full", {
  variants: {
    variant: {
      default: "bg-foreground",
      focused: "bg-info",
      running: "bg-warning",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

const Badge = ({
  render,
  className,
  variant = "default",
  ...props
}: useRender.ComponentProps<"span"> & VariantProps<typeof badgeVariants>) =>
  useRender({
    render,
    defaultTagName: "span",
    props: mergeProps<"span">(
      {
        className: badgeVariants({ variant, className }),
      },
      props,
    ),
  });

export const DockPrimitive = Object.assign(Root, { Group, Item, Button, Badge });
