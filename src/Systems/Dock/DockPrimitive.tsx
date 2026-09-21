import { mergeProps, useRender } from "@base-ui/react";
import { cn } from "#/lib/utils.ts";

function Root({ render, className, ...props }: useRender.ComponentProps<"nav">) {
  return useRender({
    render,
    defaultTagName: "nav",
    state: { slot: "dock" },
    props: mergeProps<"nav">(
      {
        "aria-label": "Application Dock",
        className: cn(
          "pointer-events-none fixed inset-x-0 bottom-2 z-[calc(infinity)] flex justify-center",
          className,
        ),
      },
      props,
    ),
  });
}

function List({ render, className, ...props }: useRender.ComponentProps<"ul">) {
  return useRender({
    render,
    defaultTagName: "ul",
    state: { slot: "dock-list" },
    props: mergeProps<"ul">(
      {
        role: "toolbar",
        "aria-label": "Dock Item",
        className: cn(
          "border-border bg-background pointer-events-auto flex items-end gap-2 rounded-xl border p-2 shadow-lg",
          className,
        ),
      },
      props,
    ),
  });
}

function Item({ render, className, ...props }: useRender.ComponentProps<"li">) {
  return useRender({
    render,
    defaultTagName: "li",
    state: { slot: "dock-item" },
    props: mergeProps<"li">(
      {
        className: cn("relative flex size-12 shrink-0 items-end", className),
      },
      props,
    ),
  });
}

function Button({ render, className, ...props }: useRender.ComponentProps<"button">) {
  return useRender({
    render,
    defaultTagName: "button",
    state: { slot: "dock-button" },
    props: mergeProps<"button">(
      {
        type: "button",
        className: cn(
          "group bg-card border-border absolute bottom-0 flex aspect-square w-full origin-bottom items-center justify-center rounded-xl border shadow-xs drop-shadow-xs",
          className,
        ),
      },
      props,
    ),
  });
}

export const DockPrimitive = Object.assign(Root, { List, Item, Button });
