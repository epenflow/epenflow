import { useCallback, useEffect, useRef, useState } from "react";

import type { RndDragCallback, RndResizeCallback } from "react-rnd";
import { useViewport } from "#/system/viewport.ts";
import type { System } from "#/system/types.ts";
import { minimize } from "#/system/process/index.ts";
import { useInstance } from "#/system/process/hooks.ts";
import { useGenie } from "#/system/genie.ts";
import { DockDOM } from "#/system/dock/index.ts";
import { gsap } from "#/lib/gsap.ts";

export function useWindowRnd(pid: string) {
  const viewport = useViewport();

  const [genie, isAnimating] = useGenie();
  const fromRef = useRef<HTMLElement>(null);

  const defaultSize = useInstance(pid, (state) => state.window.size);
  const maximized = useInstance(pid, (state) => state.window.maximized);
  const minimized = useInstance(pid, (state) => state.window.minimized);
  const id = useInstance(pid, (state) => state.id);

  const [size, setSize] = useState<System.Window.Size>(defaultSize);
  const [position, setPosition] = useState<System.Window.Position>(() => ({
    x: viewport.width / 2 - size.width / 2,
    y: (viewport.height - 32) / 2 - size.height / 2,
  }));

  useEffect(() => {
    const to = DockDOM.query(id);
    const from = fromRef.current;

    if (!to || !from) return;

    if (minimized) {
      genie.prime(from);

      genie.minimize(from, to, () => {
        minimize(pid, true);
        gsap.set(from.parentElement, {
          autoAlpha: 0,
          pointerEvents: "none",
        });
      });
    } else {
      genie.restore(from, to, () => {
        gsap.set(from.parentElement, {
          autoAlpha: 1,
          pointerEvents: "auto",
        });
      });
    }
  }, [pid, id, minimized, genie]);

  const onDragChange: RndDragCallback = useCallback((_1, data) => {
    setPosition({ x: data.x, y: data.y });
  }, []);

  const onDragStopChange: RndDragCallback = useCallback(
    (...args) => {
      onDragChange(...args);

      const from = fromRef.current;
      if (from) genie.prime(from);
    },
    // oxlint-disable-next-line react-hooks/exhaustive-deps
    [onDragChange, genie.prime],
  );

  const onResizeChange: RndResizeCallback = useCallback((_1, _2, current, _3, position) => {
    let height = current.offsetHeight,
      y = position.y;
    const width = current.offsetWidth,
      x = position.x;

    if (y < 32) {
      const overflow = 32 - y;
      y = 32;
      height = Math.max(32, height - overflow);
    }

    setPosition({ x, y });
    setSize({ width, height });
  }, []);

  const onResizeStopChange: RndResizeCallback = useCallback(
    (...args) => {
      onResizeChange(...args);

      const from = fromRef.current;
      if (from) genie.prime(from);
    },
    // oxlint-disable-next-line react-hooks/exhaustive-deps
    [onResizeChange, genie.prime],
  );

  const onAttachCanvasRef = useCallback(
    (node: HTMLCanvasElement | null) => {
      genie.attach(node);
      return () => genie.dispose();
    },
    // oxlint-disable-next-line react-hooks/exhaustive-deps
    [genie.attach],
  );

  return { size, position, onDragChange, onResizeChange, fromRef, onAttachCanvasRef };
}
