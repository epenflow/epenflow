import { useCallback, useLayoutEffect, useRef, useState, useSyncExternalStore } from "react";

import type { RndDragCallback, RndResizeCallback } from "react-rnd";
import { WindowGenie } from "#/Systems/Window/WindowGenie.ts";
import { useProcess, useProcessZIndex } from "#/Systems/Process/useProcess.ts";
import { ProcessStore } from "#/Systems/Process/ProcessStore.ts";
import { DockDOM } from "#/Systems/Dock/index.ts";
import { WindowStore } from "#/playground/WindowStore.ts";
import { useViewportObserver } from "#/playground/ViewportObserver.ts";
import type { Systems } from "#/lib/types.ts";
import { gsap, useGSAP } from "#/lib/gsap.ts";
import { DOCK_HEIGHT, TOPBAR_HEIGHT } from "#/lib/constants.ts";
import { useIsPrefersReducedMotion } from "#/hooks/use-media-query.ts";

export type CenterPositionProps = {
  target: Systems.Window.Size;
  container: Systems.Window.Size;
};

function center({ target, container }: CenterPositionProps): Systems.Window.Position {
  return {
    x: Math.floor(container.width / 2 - target.width / 2),
    y: Math.floor(container.height / 2 - target.height / 2),
  };
}

export function useWindowRnd(pid: string) {
  const contentRef = useRef<HTMLElement>(null);

  const zIndex = useProcessZIndex(pid);
  const id = useProcess(pid, (state) => state.id);
  const resizable = useProcess(pid, (state) => state.window.resizable);
  const defaultSize = useProcess(pid, (state) => state.window.size);
  const maximized = useProcess(pid, (state) => state.window.maximized);
  const minimized = useProcess(pid, (state) => state.window.minimized);

  const maximizedRef = useRef(maximized);
  const minimizedRef = useRef(minimized);

  const viewport = useViewportObserver();
  const isReducedMotion = useIsPrefersReducedMotion();

  const [store] = useState(
    () =>
      new WindowStore({
        size: defaultSize,
        position: center({
          target: defaultSize,
          container: viewport,
        }),
      }),
  );
  const [genie] = useState(
    () =>
      new WindowGenie({
        duration: isReducedMotion ? 200 : 420,
        stripCount: isReducedMotion ? 100 : 500,
        xAxisEasing: isReducedMotion ? "linear" : "power2.inOut",
        yAxisEasing: isReducedMotion ? "linear" : "power1.in",
        kickoffDuration: isReducedMotion ? 0.05 : 0.12,
      }),
  );

  const snapshot = useSyncExternalStore(
    store.subscribe,
    store.getSnapshot,
    store.getServerSnapshot,
  );

  const isTransitioning = useSyncExternalStore(
    store.subscribe,
    store.getIsAnimatingSnapshot,
    store.getIsAnimatingServerSnapshot,
  );
  const isLocked = useSyncExternalStore(
    genie.subscribe,
    genie.getSnapshot,
    genie.getServerSnapshot,
  );

  useLayoutEffect(() => {
    const wasMaximized = maximized && !maximizedRef.current;
    const wasMinimized = minimized && !minimizedRef.current;

    if (wasMaximized) {
      store.capture();
    } else if (wasMinimized && !maximizedRef.current) {
      store.capture();
    }

    maximizedRef.current = maximized;
    minimizedRef.current = minimized;
  }, [maximized, minimized, store]);

  useGSAP(() => {
    if (maximized) {
      store.maximize(
        {
          y: TOPBAR_HEIGHT,
          x: 0,
          height: viewport.height - (TOPBAR_HEIGHT + DOCK_HEIGHT),
          width: viewport.width,
        },
        {
          onComplete: () => ProcessStore.actions.maximize(pid, true),
        },
      );
    } else if (!minimizedRef.current) {
      store.restore();
    }
  }, [pid, store, maximized, viewport]);

  useGSAP(() => {
    const dock = DockDOM.query(id);
    const content = contentRef.current;

    if (!content || !dock) return;
    genie.prime(content);

    const rect = dock.getBoundingClientRect();
    const anchor = {
      height: rect.height,
      width: rect.width,
      x: rect.x,
      y: rect.y,
    };

    if (minimized) {
      genie.minimize(content, anchor, () => {
        ProcessStore.actions.minimize(pid, true);
        gsap.set(content.parentElement, {
          autoAlpha: 0,
          pointerEvents: "none",
        });
      });
    } else {
      genie.restore(content, anchor, () => {
        gsap.set(content.parentElement, {
          autoAlpha: 1,
          pointerEvents: "auto",
        });
      });
    }
  }, [pid, id, minimized, genie]);

  const onResizeChange: RndResizeCallback = useCallback(
    (_, __, current, ___, position) => {
      let height = current.offsetHeight,
        y = position.y;
      const width = current.offsetWidth,
        x = position.x;

      if (y < TOPBAR_HEIGHT) {
        const overflow = TOPBAR_HEIGHT - y;
        y = TOPBAR_HEIGHT;
        height = Math.max(TOPBAR_HEIGHT, height - overflow);
      }

      store.setState({ position: { x, y }, size: { width, height } });
    },
    [store],
  );

  const onDragChange: RndDragCallback = useCallback(
    (_, data) => {
      store.setPosition({ x: data.x, y: Math.max(TOPBAR_HEIGHT, data.y) });
    },
    [store],
  );

  const onDragStopChange: RndDragCallback = useCallback(
    (event, data) => {
      onDragChange(event, data);

      const content = contentRef.current;
      if (content) genie.prime(content);
    },
    // oxlint-disable-next-line react-hooks/exhaustive-deps
    [onDragChange, genie.prime],
  );
  const onResizeStopChange: RndResizeCallback = useCallback(
    (event, direction, element, delta, position) => {
      onResizeChange(event, direction, element, delta, position);

      const content = contentRef.current;
      if (content) genie.prime(content);
    },
    // oxlint-disable-next-line react-hooks/exhaustive-deps
    [onResizeChange, genie.prime],
  );

  const onAttachGenieRef = useCallback(
    (content: HTMLCanvasElement | null) => {
      genie.attach(content);
      return () => genie.dispose();
    },
    // oxlint-disable-next-line react-hooks/exhaustive-deps
    [genie.attach],
  );

  const interactive = !isLocked && !isTransitioning && !maximized && !minimized;

  return {
    ...snapshot,
    contentRef,
    enableResizing: resizable && interactive,
    disableDragging: !interactive,
    minWidth: Math.max(defaultSize.width - 50, viewport.width * 0.2),
    minHeight: Math.max(defaultSize.height - 50, viewport.height * 0.2),
    onDragChange,
    onResizeChange,
    onAttachGenieRef,
    onDragStopChange,
    onResizeStopChange,
    style: {
      zIndex,
    },
  };
}
