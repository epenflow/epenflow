import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type MouseEvent,
  type PointerEvent,
} from "react";

import { cn } from "cn";
import { cva, type VariantProps } from "class-variance-authority";
import { mergeProps, useRender } from "@base-ui/react";
import { ProcessStore } from "#/Systems/Process/ProcessStore.ts";
import { DOCK_HEIGHT, TOPBAR_HEIGHT } from "#/lib/constants.ts";

function Root({ render, className, ...props }: useRender.ComponentProps<"main">) {
  return useRender({
    render,
    defaultTagName: "main",
    state: { slot: "desktop" },
    props: mergeProps<"main">(
      {
        className: cn(
          "bg-background fixed inset-0 flex h-full min-h-svh flex-col overflow-clip overscroll-none contain-strict select-none",
          className,
        ),
      },
      props,
    ),
  });
}

export function Viewport({ render, className, ...props }: useRender.ComponentProps<"div">) {
  const onPointerDown = useCallback((event: PointerEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) {
      ProcessStore.actions.blur();
    }
  }, []);

  return useRender({
    render,
    defaultTagName: "div",
    state: { slot: "desktop-viewport" },
    props: mergeProps<"div">(
      {
        className: cn("absolute inset-0 -z-10 overflow-clip", className),
        onPointerDown,
      },
      props,
    ),
  });
}

interface IconsValue {
  selected: string | null;
  onSelectChange(value: string): void;
  onOpenChange(value: string): void;
}
const IconsContext = createContext<IconsValue | null>(null);

function useIcons(): IconsValue {
  const context = useContext(IconsContext);
  if (!context) {
    throw new Error("[Desktop]: <Desktop.Icon/> must be used within <Desktop.Icons/>");
  }

  return context;
}

function Icons({
  render,
  className,
  onOpenChange: onOpenChangeProp,
  ...props
}: useRender.ComponentProps<"div"> & {
  onOpenChange?: (value: string) => void;
}) {
  const [selected, setSelected] = useState<string | null>(null);

  useEffect(() => {
    const pointerdown = (event: globalThis.PointerEvent) => {
      if (event.target instanceof Element && event.target.closest("[data-slot='desktop-icon']")) {
        return;
      }

      setSelected(null);
    };

    document.addEventListener("pointerdown", pointerdown);
    return () => document.removeEventListener("pointerdown", pointerdown);
  }, []);

  const onSelectChange = useCallback((value: string) => setSelected(value), []);
  const onOpenChange = useCallback(
    (value: string) => {
      setSelected(value);
      onOpenChangeProp?.(value);
    },
    [onOpenChangeProp],
  );

  const context = useMemo(
    () => ({ selected, onSelectChange, onOpenChange }),
    [selected, onSelectChange, onOpenChange],
  );

  const children = useRender({
    render,
    defaultTagName: "div",
    state: { slot: "desktop-icons" },
    props: mergeProps<"div">(
      {
        "aria-label": "Desktop",
        role: "listbox",
        className: cn(
          "pointer-events-none absolute inset-0 flex flex-col flex-wrap-reverse content-start items-center gap-1 px-2",
          className,
        ),
        style: {
          paddingTop: TOPBAR_HEIGHT + 12,
          paddingBottom: DOCK_HEIGHT + 12,
        },
      },
      props,
    ),
  });

  return <IconsContext value={context}>{children}</IconsContext>;
}

function Icon({
  render,
  className,
  value,
  ...props
}: Omit<useRender.ComponentProps<"button">, "value"> & {
  value: string;
}) {
  const { selected, onSelectChange, onOpenChange } = useIcons();
  const isSelected = selected === value;
  const pointerTypeRef = useRef<string>("mouse");

  const onPointerDown = useCallback(
    (event: PointerEvent<HTMLButtonElement>) => {
      pointerTypeRef.current = event.pointerType;
      onSelectChange(value);
    },
    [value, onSelectChange],
  );

  const onClick = useCallback(
    (event: MouseEvent<HTMLButtonElement>) => {
      const touch = pointerTypeRef.current === "touch";
      const keyboard = event.detail === 0;
      const doble = event.detail === 2;

      if (touch || keyboard || doble) onOpenChange(value);
    },
    [value, onOpenChange],
  );

  return useRender({
    render,
    defaultTagName: "button",
    state: { slot: "desktop-icon", selected: isSelected },
    props: mergeProps<"button">(
      // oxlint-disable-next-line react/refs
      {
        type: "button",
        role: "option",
        "aria-selected": isSelected,
        className: cn(
          "group pointer-events-auto flex w-24 cursor-pointer flex-col items-center gap-2 rounded-lg p-1 outline-none select-none",
          "focus-visible:ring-ring focus-visible:ring-offset-background transition-shadow focus-visible:ring-2 focus-visible:ring-offset-1",
          "disabled:pointer-events-none disabled:opacity-64",
          className,
        ),
        onPointerDown,
        onClick,
      },
      props,
    ),
  });
}

const thumbnailVariants = cva(
  [
    "relative flex size-16 shrink-0 items-center justify-center overflow-hidden rounded-2xl border font-medium uppercase",
    "before:pointer-events-none before:absolute before:inset-0 before:rounded-[calc(var(--radius-2xl)-1px)]",
    "outline-4 outline-transparent transition-[box-shadow,outline-color] duration-100 outline-solid",
    "group-data-selected:outline-foreground/20",
  ],
  {
    defaultVariants: { variant: "info" },
    variants: {
      variant: {
        default: [
          "border-primary bg-primary text-primary-foreground shadow-primary/24 shadow-xs",
          "inset-shadow-[0_1px_--theme(--color-white/16%)]",
          "group-hover:bg-primary/90",
          "group-active:shadow-none group-active:inset-shadow-[0_1px_--theme(--color-black/8%)]",
        ],
        info: [
          "border-info bg-info shadow-info/24 text-white shadow-xs",
          "inset-shadow-[0_1px_--theme(--color-white/16%)]",
          "group-hover:bg-info/90",
          "group-active:shadow-none group-active:inset-shadow-[0_1px_--theme(--color-black/8%)]",
        ],
        outline: [
          "border-input bg-popover text-foreground shadow-xs/5 not-dark:bg-clip-padding",
          "before:shadow-[0_1px_--theme(--color-black/4%)]",
          "group-hover:bg-accent/50",
          "dark:bg-input/32 dark:group-hover:bg-input/64 dark:before:shadow-[0_-1px_--theme(--color-white/6%)]",
          "group-active:shadow-none",
        ],
      },
    },
  },
);

function Thumbnail({
  render,
  className,
  variant,
  ...props
}: useRender.ComponentProps<"div"> & VariantProps<typeof thumbnailVariants>) {
  return useRender({
    render,
    defaultTagName: "div",
    state: { slot: "desktop-icon-thumbnail" },
    props: mergeProps<"div">(
      {
        "aria-hidden": true,
        className: thumbnailVariants({ className, variant }),
      },
      props,
    ),
  });
}

function Label({ render, className, ...props }: useRender.ComponentProps<"span">) {
  return useRender({
    render,
    defaultTagName: "span",
    state: { slot: "desktop-icon-label" },
    props: mergeProps<"span">(
      {
        className: cn(
          "text-foreground/80 line-clamp-2 max-w-full rounded-md border border-transparent px-1.5 py-0.5 text-center text-xs leading-tight font-medium wrap-break-word drop-shadow-sm transition-shadow",
          "group-data-selected:border-primary group-data-selected:bg-primary group-data-selected:text-primary-foreground group-data-selected:shadow-primary/24 group-data-selected:shadow-xs group-data-selected:inset-shadow-[0_1px_--theme(--color-white/16%)] group-data-selected:drop-shadow-none",
          className,
        ),
      },
      props,
    ),
  });
}

export const Desktop = Object.assign(Root, {
  Viewport,
  Icons,
  Icon: Object.assign(Icon, {
    Thumbnail,
    Label,
  }),
});
