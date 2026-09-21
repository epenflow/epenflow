import {
  Children,
  createContext,
  isValidElement,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ComponentProps,
  type HTMLAttributes,
  type MouseEvent,
  type PointerEvent,
} from "react";

import { getCompactor } from "react-grid-layout/core";
import GridLayout, { useContainerWidth, type Layout, type LayoutItem } from "react-grid-layout";
import { cn } from "cn";
import { cva, type VariantProps } from "class-variance-authority";
import { mergeProps, useRender } from "@base-ui/react";
import { ProcessStore } from "#/Systems/Process/ProcessStore.ts";
import { DOCK_HEIGHT, TOPBAR_HEIGHT } from "#/lib/constants.ts";
// react-grid-layout ships unstyled — this is the base stylesheet it needs
// for the drag transform / placeholder to work. Import once, globally.
import "react-grid-layout/css/styles.css";

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

/* -------------------------------------------------------------------------
 * Grid geometry — tuned to match the icon's visual footprint
 * (size-16 thumbnail + label + gaps from the original flex layout).
 * ---------------------------------------------------------------------- */

const ICON_CELL_W = 96;
const ICON_CELL_H = 112;
const GRID_MARGIN: [number, number] = [8, 8];
const LAYOUT_STORAGE_KEY = "desktop:icon-layout";

interface GridPos {
  x: number;
  y: number;
}

function loadStoredPositions(): Record<string, GridPos> {
  try {
    const raw = localStorage.getItem(LAYOUT_STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Record<string, GridPos>) : {};
  } catch {
    return {};
  }
}

function persistPositions(positions: Record<string, GridPos>) {
  try {
    localStorage.setItem(LAYOUT_STORAGE_KEY, JSON.stringify(positions));
  } catch {
    // Private browsing / quota exceeded — non-fatal, just don't persist.
  }
}

/**
 * Finds the first unoccupied cell, scanning column-major (top-to-bottom,
 * then next column to the right). This is where the "macOS-ness" of new
 * icon placement lives — flip the outer loop to `x = cols - 1; x >= 0; x--`
 * if you want new icons to start from the top-right corner instead, which
 * matches classic Finder more closely.
 */
function findFreeCell(occupied: Set<string>, cols: number): GridPos {
  for (let x = 0; x < cols; x++) {
    for (let y = 0; y < 1000; y++) {
      const key = `${x},${y}`;
      if (!occupied.has(key)) return { x, y };
    }
  }
  return { x: 0, y: occupied.size };
}

/* -------------------------------------------------------------------------
 * Icons / Icon
 * ---------------------------------------------------------------------- */

interface IconsValue {
  selected: string | null;
  onSelectChange(value: string): void;
  onOpenChange(value: string): void;
  /** Returns true (and clears the flag) if `value` was just dragged, so
   *  the resulting synthetic click shouldn't be treated as an open/select. */
  consumeDragSuppression(value: string): boolean;
}
const IconsContext = createContext<IconsValue | null>(null);

function useIcons(): IconsValue {
  const context = useContext(IconsContext);
  if (!context) {
    throw new Error("[Desktop]: <Desktop.Icon/> must be used within <Desktop.Icons/>");
  }

  return context;
}

/**
 * NOTE: unlike the other primitives in this file, `Icons` doesn't accept a
 * `render` prop. It owns a `<GridLayout>` internally and needs a plain DOM
 * node to measure and mount it into — polymorphism doesn't compose cleanly
 * with that. Compose on top of the exported `Icon`/`Thumbnail`/`Label`
 * primitives instead.
 *
 * Every direct child must be a `<Desktop.Icon value={id} key={id} />` — the
 * `key` is what ties a rendered icon to its grid position.
 */
function Icons({
  className,
  children,
  onOpenChange: onOpenChangeProp,
  ...props
}: HTMLAttributes<HTMLDivElement> & {
  onOpenChange?: (value: string) => void;
}) {
  const [selected, setSelected] = useState<string | null>(null);
  const { width: containerWidth, mounted, containerRef } = useContainerWidth();
  const [layout, setLayout] = useState<Layout>([]);
  const positionsRef = useRef<Record<string, GridPos>>(loadStoredPositions());
  const dragSuppressedRef = useRef<Set<string>>(new Set());

  const cols = Math.max(1, Math.floor(containerWidth / (ICON_CELL_W + GRID_MARGIN[0])));

  // macOS never auto-rearranges existing icons when the window is resized or
  // an icon is added/removed — it only refuses to drop one on top of
  // another. `getCompactor(null, false, true)` gives us exactly that: no
  // compaction (`null`), no overlapping (`allowOverlap: false`), and a
  // rejected — not swapped — drop on collision (`preventCollision: true`).
  const compactor = useMemo(() => getCompactor(null, false, true), []);

  const ids = useMemo(
    () =>
      Children.toArray(children)
        .map((child) => (isValidElement(child) ? child.key : null))
        .filter((key): key is string => typeof key === "string"),
    [children],
  );

  // Reconcile layout with the current set of icon ids: keep existing
  // positions untouched, place newly-appeared ids into the first free cell,
  // and drop ids that disappeared. This is what avoids the "everything
  // reflows when one icon is added/removed" feeling.
  useEffect(() => {
    setLayout((prev) => {
      const known = new Map<string, LayoutItem>(prev.map((item) => [item.i, item]));
      const occupied = new Set(prev.map((item) => `${item.x},${item.y}`));
      let changed = ids.length !== prev.length;

      const next: LayoutItem[] = ids.map((id) => {
        const existing = known.get(id);
        if (existing) return existing;

        changed = true;
        const stored = positionsRef.current[id];
        const pos = stored ?? findFreeCell(occupied, cols);
        occupied.add(`${pos.x},${pos.y}`);
        return { i: id, x: pos.x, y: pos.y, w: 1, h: 1 };
      });

      return changed ? next : prev;
    });
  }, [ids, cols]);

  const onSelectChange = useCallback((value: string) => setSelected(value), []);
  const onOpenChange = useCallback(
    (value: string) => {
      setSelected(value);
      onOpenChangeProp?.(value);
    },
    [onOpenChangeProp],
  );

  const consumeDragSuppression = useCallback((value: string) => {
    if (dragSuppressedRef.current.has(value)) {
      dragSuppressedRef.current.delete(value);
      return true;
    }
    return false;
  }, []);

  const onDragStop: ComponentProps<typeof GridLayout>["onDragStop"] = useCallback(
    (_layout, oldItem, newItem) => {
      if (oldItem && newItem && (oldItem.x !== newItem.x || oldItem.y !== newItem.y)) {
        dragSuppressedRef.current.add(newItem.i);
      }
    },
    [],
  );

  const onLayoutChange = useCallback((next: Layout) => {
    setLayout(next);
    const positions: Record<string, GridPos> = {};
    for (const item of next) positions[item.i] = { x: item.x, y: item.y };
    positionsRef.current = positions;
    persistPositions(positions);
  }, []);

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

  const context = useMemo<IconsValue>(
    () => ({ selected, onSelectChange, onOpenChange, consumeDragSuppression }),
    [selected, onSelectChange, onOpenChange, consumeDragSuppression],
  );

  return (
    <IconsContext value={context}>
      <div
        {...props}
        ref={containerRef}
        aria-label="Desktop"
        role="listbox"
        data-slot="desktop-icons"
        className={cn("pointer-events-none absolute inset-0 overflow-clip", className)}
        style={{
          paddingTop: TOPBAR_HEIGHT + 12,
          paddingBottom: DOCK_HEIGHT + 12,
        }}>
        {mounted && (
          <GridLayout
            className="pointer-events-auto"
            layout={layout}
            width={containerWidth}
            gridConfig={{
              cols,
              rowHeight: ICON_CELL_H,
              margin: GRID_MARGIN,
              containerPadding: [0, 0],
            }}
            dragConfig={{ enabled: true, handle: "[data-slot='desktop-icon']" }}
            resizeConfig={{ enabled: false }}
            compactor={compactor}
            onDragStop={onDragStop}
            onLayoutChange={onLayoutChange}>
            {children}
          </GridLayout>
        )}
      </div>
    </IconsContext>
  );
}

function Icon({
  render,
  className,
  value,
  ...props
}: Omit<useRender.ComponentProps<"button">, "value"> & {
  value: string;
}) {
  const { selected, onSelectChange, onOpenChange, consumeDragSuppression } = useIcons();
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
      // A click fired right after a real drag is a side-effect of the
      // mouseup, not user intent to open the icon — swallow it.
      if (consumeDragSuppression(value)) return;

      const touch = pointerTypeRef.current === "touch";
      const keyboard = event.detail === 0;
      const doble = event.detail === 2;

      if (touch || keyboard || doble) onOpenChange(value);
    },
    [value, onOpenChange, consumeDragSuppression],
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
          "group flex cursor-grab flex-col items-center gap-2 rounded-lg p-1 outline-none select-none active:cursor-grabbing",
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
