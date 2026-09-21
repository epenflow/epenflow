import { useCallback, useMemo, type FC, type ReactNode } from "react";

import { Rnd } from "react-rnd";
import { cn } from "cn";
import { cva, type VariantProps } from "class-variance-authority";
import { mergeProps, useRender } from "@base-ui/react";
import { useWindowRnd } from "#/Systems/Window/useWindowRnd.ts";
import { useWindowMotion } from "#/Systems/Window/useWindowMotion.ts";
import { useProcessFocused } from "#/Systems/Process/useProcess.ts";
import { ProcessStore } from "#/Systems/Process/ProcessStore.ts";
import type { Systems } from "#/lib/types.ts";
import { Portal } from "#/components/ui/portal.tsx";

const rootVariants = cva(
  "border-border bg-background isolate flex size-full overflow-hidden overscroll-none rounded-2xl border shadow-2xl select-auto",
  {
    variants: {
      mode: {
        default: "flex-col",
        sidebar: "flex-row",
        unified: "flex-col",
      },
      variant: {
        default: "bg-background",
        light: "bg-background border-border/50",
        prominent: "bg-card border-border",
      },
      focused: {
        true: "ring-ring/20 ring-1",
        false: "opacity-100 shadow-md",
      },
    },
    defaultVariants: {
      mode: "default",
      variant: "default",
      focused: true,
    },
  },
);

const headerVariants = cva(
  "border-border relative flex h-8 cursor-grab items-center border-b p-2 transition-colors duration-200",
  {
    variants: {
      variant: {
        default: "bg-background/95 hover:bg-background border-border",
        light: "bg-background/50 hover:bg-background/70 border-border/30",
        prominent: "bg-card hover:bg-card/95 border-border",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

const buttonVariants = cva(
  "group relative box-border flex h-3 w-3 cursor-pointer items-center justify-center overflow-hidden rounded-full border transition-all duration-100 hover:scale-110 focus-visible:ring-2 focus-visible:ring-blue-500/50 focus-visible:ring-offset-1 focus-visible:outline-none active:scale-95 [&>svg]:opacity-0 [&>svg]:transition-opacity [&>svg]:duration-200 [&>svg]:ease-in [&>svg]:group-hover:opacity-100",
  {
    variants: {
      intent: {
        close:
          "border-[#E0443E] bg-[#FF5F56] hover:border-[#D23D35] hover:bg-[#FF7D72] active:border-[#BF4942] active:bg-[#BF4942] [&>svg>path]:stroke-[#4d0000]",
        minimize:
          "border-[#DEA123] bg-[#FFBD2E] hover:border-[#CF9B1A] hover:bg-[#FFCC4D] active:border-[#BF8E22] active:bg-[#BF8E22] [&>svg>path]:stroke-[#995700]",
        maximize:
          "border-[#1AAB29] bg-[#27C93F] hover:border-[#189827] hover:bg-[#37D951] active:border-[#1D9730] active:bg-[#1D9730] [&>svg>path]:fill-[#004d09]",
      },
      focused: {
        false:
          "border-[#CECECE]! bg-[#DFDFDF]! hover:border-[#B5B5B5]! hover:bg-[#DFDFDF]! active:border-[#B5B5B5]! active:bg-[#CECECE]!",
      },
    },
    defaultVariants: {
      intent: "close",
      focused: true,
    },
    compoundVariants: [
      {
        intent: ["close", "minimize"],
        focused: false,
        className: "[&>svg>path]:stroke-[#999999]",
      },
      {
        intent: "maximize",
        focused: false,
        className: "[&>svg>path]:fill-[#999999]",
      },
    ],
  },
);

function Root({
  pid,
  render,
  className,
  mode,
  variant = "default",
  ...props
}: useRender.ComponentProps<"div"> &
  Omit<VariantProps<typeof rootVariants>, "focused"> & {
    variant?: VariantProps<typeof rootVariants>["variant"];
  } & Systems.Process.ComponentProps) {
  const {
    genieRef,
    size,
    position,
    minWidth,
    minHeight,
    style,
    disableDragging,
    enableResizing,
    onDragChange,
    onResizeChange,
    onAttachGenieRef,
    onDragStopChange,
    onResizeStopChange,
  } = useWindowRnd(pid);

  const focused = useProcessFocused(pid);
  const motionRef = useWindowMotion(pid);

  const onFocusChange = useCallback(() => {
    if (focused) return;
    ProcessStore.actions.focus(pid);
  }, [pid, focused]);

  const children = useRender({
    render,
    ref: [genieRef, motionRef],
    defaultTagName: "div",
    state: {
      slot: "window",
    },
    props: mergeProps<"div">(
      {
        "aria-label": "window",
        role: "region",
        className: rootVariants({ focused, mode, variant, className }),
        onMouseDownCapture: onFocusChange,
      },
      props,
    ),
  });

  return (
    <>
      <Rnd
        bounds="parent"
        cancel="[data-dragging='none']"
        size={size}
        disableDragging={disableDragging}
        enableResizing={enableResizing}
        position={position}
        minWidth={minWidth}
        minHeight={minHeight}
        onDrag={onDragChange}
        onDragStart={onDragChange}
        onResize={onResizeChange}
        onResizeStop={onResizeStopChange}
        onDragStop={onDragStopChange}
        onMouseDown={onFocusChange}>
        {children}
      </Rnd>
      <Portal
        aria-hidden={true}
        render={<canvas ref={onAttachGenieRef} />}
        style={style}
        container={document.querySelector<HTMLElement>("[data-slot='desktop']")}
        className="pointer-events-none fixed inset-0 isolate overflow-clip rounded-xl"
      />
    </>
  );
}

function createButton(intent: VariantProps<typeof buttonVariants>["intent"], children?: ReactNode) {
  const Button: FC<useRender.ComponentProps<"button"> & VariantProps<typeof buttonVariants>> = ({
    render,
    className,
    focused,
    intent: intentProp,
    ...props
  }) => {
    const state = useMemo(() => ({ dragging: "none", focused, slot: intent }), [focused]);

    return useRender({
      render,
      state,
      defaultTagName: "button",
      props: mergeProps<"button">(
        {
          "aria-label": intent ?? undefined,
          title: intent ?? undefined,
          type: "button",
          className: buttonVariants({ intent: intentProp ?? intent, focused, className }),
          children,
        },
        props,
      ),
    });
  };
  Button.displayName =
    intent == null
      ? "Button"
      : `Button.${intent.slice(0, 1).toUpperCase()}${intent.slice(1, intent.length)}`;

  return Button;
}

const Close = createButton(
  "close",
  <svg
    width="6"
    height="6"
    viewBox="0 0 6 6"
    fill="none"
    aria-hidden={true}
    focusable={false}
    xmlns="http://www.w3.org/2000/svg">
    <path d="M1 1L5 5M1 5L5 1" strokeWidth="1.2" strokeLinecap="round" />
  </svg>,
);

const Minimize = createButton(
  "minimize",
  <svg
    width="6"
    height="6"
    viewBox="0 0 6 6"
    aria-hidden={true}
    focusable={false}
    fill="none"
    xmlns="http://www.w3.org/2000/svg">
    <path d="M1 3H5" strokeWidth="1.2" strokeLinecap="round" />
  </svg>,
);

const Maximize = createButton(
  "maximize",
  <svg
    width="6"
    height="6"
    viewBox="0 0 6 6"
    fill="none"
    aria-hidden={true}
    focusable={false}
    xmlns="http://www.w3.org/2000/svg">
    <path d="M1 1L3.5 1L1 3.5V1Z" />
    <path d="M5 5L2.5 5L5 2.5V5Z" />
  </svg>,
);

function Sidebar({ render, className, ...props }: useRender.ComponentProps<"aside">) {
  return useRender({
    render,
    defaultTagName: "aside",
    state: { slot: "window-sidebar" },
    props: mergeProps<"aside">(
      {
        "aria-label": "window sidebar",
        className: cn(
          "border-border bg-sidebar text-sidebar-foreground flex h-full w-56 shrink-0 flex-col border-r",
          className,
        ),
      },
      props,
    ),
  });
}

function Header({
  render,
  className,
  variant = "default",
  ...props
}: useRender.ComponentProps<"header"> & {
  variant?: VariantProps<typeof headerVariants>["variant"];
}) {
  return useRender({
    render,
    defaultTagName: "header",
    state: { slot: "window-header" },
    props: mergeProps<"header">(
      {
        "aria-label": "window header",
        className: cn(headerVariants({ variant }), className),
      },
      props,
    ),
  });
}

function Viewport({ render, className, ...props }: useRender.ComponentProps<"div">) {
  return useRender({
    render,
    defaultTagName: "div",
    state: { slot: "window-viewport" },
    props: mergeProps<"div">(
      {
        "aria-label": "window viewport",
        className: cn(
          "relative flex flex-1 cursor-auto flex-col overflow-hidden overscroll-none select-text",
          className,
        ),
      },
      props,
    ),
  });
}

function Group({ render, className, ...props }: useRender.ComponentProps<"div">) {
  return useRender({
    render,
    defaultTagName: "div",
    state: { slot: "window-group" },
    props: mergeProps<"div">(
      {
        "aria-label": "window group",
        role: "group",
        className: cn(
          "flex h-full w-fit cursor-default items-center justify-center gap-1",
          className,
        ),
      },
      props,
    ),
  });
}

function Titlebar({ render, className, ...props }: useRender.ComponentProps<"div">) {
  return useRender({
    render,
    defaultTagName: "div",
    state: { slot: "window-titlebar" },
    props: mergeProps<"div">(
      {
        "aria-label": "window titlebar",
        "aria-hidden": true,
        className: cn(
          "text-foreground/80 pointer-events-none absolute inset-0 flex items-center justify-center text-sm font-medium drop-shadow-sm select-none",
          className,
        ),
      },
      props,
    ),
  });
}

export const WindowPrimitive = Object.assign(Root, {
  Close,
  Minimize,
  Maximize,
  Viewport,
  Header,
  Group,
  Titlebar,
  Sidebar,
});
