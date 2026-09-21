import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";

import {
  Rnd,
  type Position,
  type RndDragCallback,
  type RndResizeCallback,
  type ResizableDelta as Size,
} from "react-rnd";
import { createPortal } from "react-dom";
import { useThrottledCallback } from "@tanstack/react-pacer";
import { mergeProps, useRender } from "@base-ui/react";
import { WindowStore } from "#/playground/WindowStore.ts";
import { GenieController } from "#/playground/GenieController.ts";
import { cn, hasWindow } from "#/lib/utils.ts";
import { Button } from "#/components/ui/button.tsx";

const getWindowWidth = () => (hasWindow() ? window.innerWidth : 0);
const getWindowHeight = () => (hasWindow() ? window.innerHeight : 0);

function centerPosition({ height, width }: Size): Position {
  const [vw, vh] = [getWindowWidth(), getWindowHeight()];

  return {
    x: Math.floor(vw / 2 - width / 2),
    y: Math.floor(vh / 2 - height / 2),
  };
}

const BORDER_SIZE = 0.5;
const TOPBAR_HEIGHT = 32 + BORDER_SIZE;
const DOCK_HEIGHT = 65.6 + 8 + BORDER_SIZE;
const DEFAULT_SIZE: Size = { height: 250, width: 300 };

type WindowMode = "normal" | "maximized" | "minimized";

export interface ProtoWindowProps extends useRender.ComponentProps<"div"> {
  minimizeAnchor?: () => Position;
}

export function ProtoWindow({ render, className, minimizeAnchor, ...props }: ProtoWindowProps) {
  const [store] = useState(
    () => new WindowStore({ size: DEFAULT_SIZE, position: centerPosition(DEFAULT_SIZE) }),
  );
  const [genie] = useState(() => new GenieController());

  useEffect(() => () => genie.dispose(), [genie]);

  const [mode, setMode] = useState<WindowMode>("normal");

  const modeRef = useRef<WindowMode>("normal");

  const contentRef = useRef<HTMLDivElement>(null);

  const snapshot = useSyncExternalStore(
    store.subscribe,
    store.getSnapshot,
    store.getServerSnapshot,
  );
  const viewport = useSyncExternalStore(
    store.subscribeToViewport,
    store.getViewportSnapshot,
    store.getViewportServerSnapshot,
  );
  const isTransitioning = useSyncExternalStore(
    store.subscribe,
    store.getIsAnimatingSnapshot,
    store.getIsAnimatingServerSnapshot,
  );
  const busy = useSyncExternalStore(genie.subscribe, genie.getSnapshot, genie.getServerSnapshot);

  const isBusy = isTransitioning || busy;
  const interactive = mode === "normal" && !isBusy;

  const onDragChange: RndDragCallback = useThrottledCallback(
    (_, data) => {
      store.setPosition({ x: data.x, y: Math.max(TOPBAR_HEIGHT, data.y) });
    },
    { wait: 16 },
  );

  const onResizeChange: RndResizeCallback = useThrottledCallback(
    (_, __, current, ___, position) => {
      let height = current.offsetHeight,
        y = position.y;
      const width = current.offsetWidth,
        x = position.x;

      if (y < TOPBAR_HEIGHT) {
        const overflow = TOPBAR_HEIGHT - y;
        y = TOPBAR_HEIGHT;
        height = Math.max(50, height - overflow);
      }
      store.setSize({ width, height });
      store.setPosition({ x, y });
    },
    { wait: 16 },
  );

  const onMaximizeChange = useCallback(() => {
    if (isBusy || mode === "minimized") return;

    if (mode === "maximized") {
      store.restoreSnapshotWithTransition({
        onComplete: () => setMode("normal"),
      });
      return;
    }

    store.capture();
    store.maximize(
      {
        width: viewport.width,
        height: viewport.height - (TOPBAR_HEIGHT + DOCK_HEIGHT),
        y: TOPBAR_HEIGHT,
        x: 0,
      },
      { onComplete: () => setMode("maximized") },
    );
  }, [isBusy, mode, store, viewport]);

  const onMinimizeChange = useCallback(() => {
    const content = contentRef.current;
    if (!content || isBusy) return;

    const anchor = minimizeAnchor?.() ?? genie.getAnchor();

    if (mode === "minimized") {
      genie.restore(content, anchor, () => setMode(modeRef.current));

      return;
    }

    modeRef.current = mode;
    genie.minimize(content, anchor, () => setMode("minimized"));
  }, [isBusy, genie, minimizeAnchor, mode]);

  const handleMinimizePointerDown = useCallback(() => {
    if (mode === "minimized" || isBusy) return;
    const content = contentRef.current;
    if (content) genie.prime(content);
  }, [genie, mode, isBusy]);

  const children = useRender({
    render,
    defaultTagName: "div",
    props: mergeProps<"div">(
      {
        className: cn("size-full border bg-indigo-500", className),
        children: (
          <>
            {JSON.stringify({ store: viewport })}
            <Button
              disabled={isBusy}
              onClick={onMinimizeChange}
              onPointerDown={handleMinimizePointerDown}>
              {mode === "minimized" ? "restore" : "minimize"}
            </Button>
            <Button disabled={isBusy || mode === "minimized"} onClick={onMaximizeChange}>
              {mode === "maximized" ? "restore" : "maximize"}
            </Button>
          </>
        ),
      },
      props,
    ),
  });

  const onAttachGenieRef = useCallback(
    (node: HTMLCanvasElement | null) => {
      genie.attach(node);
      return () => genie.attach(null);
    },
    // oxlint-disable-next-line react-hooks/exhaustive-deps
    [genie.attach],
  );

  return (
    <>
      <Button onClick={onMinimizeChange}>restore</Button>
      <Rnd
        className={cn(mode === "minimized" && "pointer-events-none invisible")}
        size={snapshot.size}
        position={snapshot.position}
        bounds="parent"
        disableDragging={!interactive}
        enableResizing={interactive}
        onDragStart={onDragChange}
        onDrag={onDragChange}
        onResize={onResizeChange}>
        <div ref={contentRef} className="size-full">
          {children}
        </div>
      </Rnd>

      {hasWindow() &&
        createPortal(
          <canvas
            ref={onAttachGenieRef}
            aria-hidden
            className="pointer-events-none fixed inset-0"
          />,
          document.querySelector<HTMLElement>("[data-slot='desktop']")!,
        )}
    </>
  );
}
