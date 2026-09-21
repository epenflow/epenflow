import {
  createContext,
  use,
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type FC,
  type ReactNode,
} from "react";

import {
  Menu as MenuPrimitive,
  Menubar as MenubarPrimitive,
  mergeProps,
  useRender,
} from "@base-ui/react";
import { cn } from "#/lib/utils.ts";

function Root({ render, className, ...props }: useRender.ComponentProps<"header">) {
  return useRender({
    render,
    defaultTagName: "header",
    state: { slot: "topbar" },
    props: mergeProps<"header">(
      {
        className: cn(
          "border-border sticky top-0 z-50 flex h-8 items-center gap-3 border-b select-none",
          "bg-background text-foreground px-2 text-[13px] leading-none backdrop-blur-md backdrop-saturate-150",
          className,
        ),
      },
      props,
    ),
  });
}

interface SectionContextValues {
  registerItem: (id: string, element: HTMLElement | null, priority: number) => void;
  hiddenIds: ReadonlySet<string>;
}

const SectionContext = createContext<SectionContextValues | null>(null);

function useSection() {
  const context = use(SectionContext);

  if (!context) {
    throw new Error("useSection() must be used within <SectionContext/>");
  }

  return context;
}

function createSection(slot: "left" | "center" | "right") {
  function useOverflow(enabled: boolean) {
    const sectionRef = useRef<HTMLElement>(null);
    const itemsRef = useRef(new Map<string, { element: HTMLElement; priority: number }>());

    const [hiddenIds, setHiddenIds] = useState<ReadonlySet<string>>(() => new Set());

    const recalculate = useCallback(() => {
      const section = sectionRef.current;
      if (!section || !enabled) return;

      for (const [_, { element }] of itemsRef.current) {
        element.removeAttribute("hidden");
      }

      if (section.scrollWidth <= section.clientWidth + 1) {
        setHiddenIds((prev) => (prev.size === 0 ? prev : new Set()));

        return;
      }

      const asc = Array.from(itemsRef.current.entries()).sort(
        (a, b) => a[1].priority - b[1].priority,
      );

      const nextHidden = new Set<string>();

      for (const [id, { element }] of asc) {
        element.setAttribute("hidden", "");
        nextHidden.add(id);

        if (section.scrollWidth <= section.clientWidth + 1) {
          break;
        }
      }

      setHiddenIds(nextHidden);
    }, [enabled]);

    useLayoutEffect(() => {
      const section = sectionRef.current;
      if (!enabled || !section) return;

      const observer = new ResizeObserver(() => recalculate());
      observer.observe(section);
      recalculate();

      return () => observer.disconnect();
    }, [enabled, recalculate]);

    const registerItem = useCallback(
      (id: string, element: HTMLElement | null, priority: number) => {
        if (element) {
          itemsRef.current.set(id, { element, priority });
        } else {
          itemsRef.current.delete(id);
        }

        recalculate();
      },
      [recalculate],
    );

    return { sectionRef, hiddenIds, registerItem };
  }

  type SectionProps = FC<
    useRender.ComponentProps<"section"> & {
      collapsible?: boolean;
    }
  >;

  const Section: SectionProps = ({ render, className, collapsible = false, ...props }) => {
    const { sectionRef, hiddenIds, registerItem } = useOverflow(collapsible);

    const context = useMemo(() => ({ hiddenIds, registerItem }), [hiddenIds, registerItem]);

    const children = useRender({
      render,
      defaultTagName: "section",
      state: { slot: `topbar-${slot}` },
      ref: sectionRef,
      props: mergeProps<"section">(
        {
          className: cn(
            "flex min-w-0 items-center overflow-hidden",
            {
              "gap-1": slot === "left",
              "flex-1 justify-center gap-2": slot === "center",
              "ml-auto gap-3.5": slot === "right",
            },
            className,
          ),
        },
        props,
      ),
    });

    return <SectionContext value={context}>{children}</SectionContext>;
  };
  Section.displayName = `Topbar.${slot[0].toUpperCase()}${slot.slice(1)}`;

  return Section;
}

const Left = createSection("left");
const Center = createSection("center");
const Right = createSection("right");

function Item({
  render,
  className,
  priority,
  ...props
}: useRender.ComponentProps<"div"> & {
  priority?: number;
}) {
  const section = useSection();

  const id = useId();
  const scopeRef = useRef<HTMLDivElement>(null);
  const [collapsed, setCollapsed] = useState<boolean>(() => section.hiddenIds.has(id) ?? false);

  useLayoutEffect(() => {
    const scope = scopeRef.current;
    if (!section || typeof priority === "undefined" || !scope) return;

    section.registerItem(id, scope, priority);
    return () => section.registerItem(id, null, priority);
  }, [id, section, priority]);

  if (section.hiddenIds.has(id)) {
    setCollapsed(true);
  }

  return useRender({
    render,
    defaultTagName: "div",
    ref: scopeRef,
    state: { collapsed, slot: "topbar-section-item" },
    props: mergeProps<"div">(
      {
        className: cn("flex shrink-0 items-center", className),
      },
      props,
    ),
  });
}

function Status({ render, className, ...props }: useRender.ComponentProps<"div">) {
  return useRender({
    render,
    defaultTagName: "div",
    state: { slot: "topbar-status" },
    props: mergeProps<"div">(
      {
        role: "group",
        className: cn("flex items-center gap-2.5", className),
      },
      props,
    ),
  });
}

function StatusItem({
  render,
  className,
  active = false,
  ...props
}: useRender.ComponentProps<"button"> & { active?: boolean }) {
  return useRender({
    render,
    defaultTagName: "button",
    state: { active, slot: "topbar-status-item" },
    props: mergeProps<"button">(
      {
        type: "button",
        className: cn(
          "text-foreground inline-flex cursor-default items-center gap-1 rounded-xs px-1.5 py-0.5 outline-none",
          "hover:bg-accent hover:text-accent-foreground data-popup-open:bg-accent data-popup-open:text-accent-foreground data-active:bg-accent data-active:text-accent-foreground",
          className,
        ),
      },
      props,
    ),
  });
}

const formatter = new Intl.DateTimeFormat(undefined, {
  weekday: "short",
  month: "short",
  day: "numeric",
  hour: "numeric",
  minute: "2-digit",
});

export function Clock({
  updateIntervalMs = 30_000,
  render,
  className,
  format,
  ...props
}: useRender.ComponentProps<"time"> & {
  format?: (date: Date) => string;
  updateIntervalMs?: number;
}) {
  const [now, setNow] = useState<Date>(() => new Date());

  useEffect(() => {
    const intervalId = setInterval(() => setNow(new Date()), updateIntervalMs);

    return () => void clearInterval(intervalId);
  }, [updateIntervalMs]);

  const formatted = useMemo(() => (format ? format(now) : formatter.format(now)), [format, now]);

  return useRender({
    render,
    defaultTagName: "time",
    state: { slot: "clock" },
    props: mergeProps<"time">(
      {
        suppressHydrationWarning: true,
        children: formatted,
        dateTime: now.toISOString(),
        className: cn("text-primary whitespace-nowrap tabular-nums", className),
      },
      props,
    ),
  });
}

const resolveBaseUIClassName =
  <T,>(defaultClassName: string, className?: string | ((state: T) => string | undefined)) =>
  (state: T) =>
    cn(defaultClassName, typeof className === "function" ? className(state) : className);

function Menubar({ className, ...props }: MenubarPrimitive.Props) {
  return (
    <MenubarPrimitive
      data-slot="topbar-menubar"
      className={resolveBaseUIClassName("flex h-full items-center gap-0.5", className)}
      {...props}
    />
  );
}
const Menu = MenuPrimitive.Root;
function MenuTrigger({ className, ...props }: MenuPrimitive.Trigger.Props) {
  return (
    <MenuPrimitive.Trigger
      data-slot="topbar-menu-trigger"
      className={resolveBaseUIClassName(
        cn(
          "text-foreground flex h-6 cursor-default items-center rounded-md px-2 text-[13px] font-medium outline-none",
          "hover:bg-accent hover:text-accent-foreground data-popup-open:bg-accent data-popup-open:text-accent-foreground",
          "data-disabled:text-muted-foreground data-disabled:pointer-events-none",
        ),
        className,
      )}
      {...props}
    />
  );
}

interface MenubarContentProps extends MenuPrimitive.Popup.Props {
  sideOffset?: MenuPrimitive.Positioner.Props["sideOffset"];
  align?: MenuPrimitive.Positioner.Props["align"];
  container?: MenuPrimitive.Portal.Props["container"];
}

function MenuContent({
  className,
  sideOffset = 6,
  align = "start",
  container,
  ...props
}: MenubarContentProps) {
  return (
    <MenuPrimitive.Portal container={container}>
      <MenuPrimitive.Positioner
        className="isolate z-50 outline-none"
        sideOffset={sideOffset}
        align={align}>
        <MenuPrimitive.Popup
          data-slot="topbar-menu-content"
          className={resolveBaseUIClassName(
            cn(
              "border-border bg-popover text-popover-foreground z-50 min-w-40 overflow-hidden rounded-md border p-1 shadow-md outline-none",
              "origin-(--transform-origin) data-ending-style:scale-95 data-ending-style:opacity-0 data-starting-style:scale-95 data-starting-style:opacity-0",
              "transition-[opacity,transform] duration-100 ease-out",
            ),
            className,
          )}
          {...props}
        />
      </MenuPrimitive.Positioner>
    </MenuPrimitive.Portal>
  );
}

function MenuItem({
  className,
  inset,
  variant = "default",
  ...props
}: MenuPrimitive.Item.Props & {
  inset?: boolean;
  variant?: "default" | "destructive";
}) {
  return (
    <MenuPrimitive.Item
      data-slot="topbar-menu-item"
      data-inset={inset ? "" : undefined}
      data-variant={variant}
      className={resolveBaseUIClassName(
        cn(
          "relative flex cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-[13px] outline-none select-none",
          "data-highlighted:bg-accent data-highlighted:text-accent-foreground",
          "data-disabled:pointer-events-none data-disabled:opacity-50",
          "data-inset:pl-7",
          "data-[variant=destructive]:text-destructive data-[variant=destructive]:data-highlighted:bg-destructive/10",
          "[&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
        ),
        className,
      )}
      {...props}
    />
  );
}

function MenuSeparator({ className, ...props }: MenuPrimitive.Separator.Props) {
  return (
    <MenuPrimitive.Separator
      data-slot="topbar-menu-separator"
      className={resolveBaseUIClassName("-mx-1 my-1 h-px bg-border", className)}
      {...props}
    />
  );
}

function MenuGroup({
  className,
  label,
  children,
  ...props
}: MenuPrimitive.Group.Props & { label?: ReactNode }) {
  return (
    <MenuPrimitive.Group
      data-slot="topbar-menu-group"
      className={resolveBaseUIClassName("", className)}
      {...props}>
      {label ? (
        <MenuPrimitive.GroupLabel
          data-slot="topbar-menu-group-label"
          className="text-muted-foreground px-2 py-1.5 text-xs font-medium">
          {label}
        </MenuPrimitive.GroupLabel>
      ) : null}
      {children}
    </MenuPrimitive.Group>
  );
}

const MenuSubmenu = MenuPrimitive.SubmenuRoot;
function MenuSubmenuTrigger({
  className,
  inset,
  children,
  ...props
}: MenuPrimitive.SubmenuTrigger.Props & { inset?: boolean }) {
  return (
    <MenuPrimitive.SubmenuTrigger
      data-slot="topbar-menu-submenu-trigger"
      data-inset={inset ? "" : undefined}
      className={resolveBaseUIClassName(
        cn(
          "flex cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-[13px] outline-none select-none",
          "data-highlighted:bg-accent data-highlighted:text-accent-foreground",
          "data-popup-open:bg-accent data-popup-open:text-accent-foreground",
          "data-inset:pl-7",
        ),
        className,
      )}
      {...props}>
      {children}
      <ChevronGlyph className="ml-auto" />
    </MenuPrimitive.SubmenuTrigger>
  );
}

function ChevronGlyph({ className }: { className?: string }) {
  return (
    <svg
      className={cn("size-4 shrink-0", className)}
      viewBox="0 0 16 16"
      fill="currentColor"
      aria-hidden="true">
      <path d="M6 12V4l4.5 4z" />
    </svg>
  );
}

function MenuSubmenuContent({
  className,
  sideOffset = 0,
  align = "start",
  container,
  ...props
}: MenubarContentProps) {
  return (
    <MenuPrimitive.Portal container={container}>
      <MenuPrimitive.Positioner
        className="isolate z-50 outline-none"
        sideOffset={sideOffset}
        align={align}>
        <MenuPrimitive.Popup
          data-slot="topbar-menu-submenu-content"
          className={resolveBaseUIClassName(
            cn(
              "border-border bg-popover text-popover-foreground z-50 min-w-40 overflow-hidden rounded-md border p-1 shadow-md outline-none",
              "origin-(--transform-origin) data-ending-style:scale-95 data-ending-style:opacity-0 data-starting-style:scale-95 data-starting-style:opacity-0",
              "transition-[opacity,transform] duration-100 ease-out",
              "w-auto",
            ),
            className,
          )}
          {...props}
        />
      </MenuPrimitive.Positioner>
    </MenuPrimitive.Portal>
  );
}

function Mark({
  render,
  className,
  children,
  "aria-label": ariaLabel = "Menu",
  ...props
}: useRender.ComponentProps<"button">) {
  return useRender({
    defaultTagName: "button",
    render,
    state: { slot: "topbar-mark" },
    props: mergeProps<"button">(
      {
        type: "button",
        className: cn(
          "text-foreground inline-flex h-6 w-6 cursor-default items-center justify-center rounded-md outline-none",
          "hover:bg-accent hover:text-accent-foreground data-popup-open:bg-accent data-popup-open:text-accent-foreground",
          className,
        ),
        "aria-label": ariaLabel,
        children: children ?? <PlaceholderGlyph />,
      },
      props,
    ),
  });
}

function PlaceholderGlyph() {
  return (
    <svg viewBox="0 0 16 16" width="14" height="14" fill="currentColor" aria-hidden="true">
      <circle cx="8" cy="8" r="6" />
    </svg>
  );
}

export const TopbarPrimitive = Object.assign(Root, {
  Left,
  Center,
  Right,
  Item,
  Status,
  StatusItem,
  Clock,
  Menubar,
  MenuTrigger,
  MenuContent,
  MenuItem,
  MenuSeparator,
  MenuGroup,
  MenuSubmenu,
  MenuSubmenuTrigger,
  MenuSubmenuContent,
  Menu,
  Mark,
});
