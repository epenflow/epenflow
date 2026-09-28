import { cn } from "cn";
import { mergeProps, useRender } from "@base-ui/react";

function Root({ render, className, ...props }: useRender.ComponentProps<"main">) {
  return useRender({
    render,
    defaultTagName: "main",
    props: mergeProps<"main">(
      {
        className: cn(
          "fixed inset-0 flex h-full min-h-svh flex-col overflow-clip overscroll-none contain-strict select-none",
          "bg-background",
          className,
        ),
      },
      props,
    ),
  });
}

function Viewport({ render, className, ...props }: useRender.ComponentProps<"div">) {
  return useRender({
    render,
    defaultTagName: "div",
    props: mergeProps(
      {
        className: cn("absolute inset-0 top-8 -z-10 h-full overflow-clip", className),
      },
      props,
    ),
  });
}
function Group() {}
function Item() {}
function Label() {}

export const DesktopPrimitive = Object.assign(Root, {
  Viewport,
  Group: Object.assign(Group, { Item, Label }),
});
