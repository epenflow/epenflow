import { cn } from "cn";
import { mergeProps, useRender } from "@base-ui/react";

const Root = ({ render, className, ...props }: useRender.ComponentProps<"header">) =>
  useRender({
    render,
    defaultTagName: "header",
    props: mergeProps<"header">(
      {
        className: cn(
          "fixed inset-x-0 top-0 z-[calc(infinity)] h-8 items-center gap-3 select-none",
          "border-border bg-card border-b",
          className,
        ),
      },
      props,
    ),
  });

export const TopbarPrimitive = Object.assign(Root, {});
