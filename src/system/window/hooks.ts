import { useCallback, useState } from "react";

import type { RndDragCallback, RndResizeCallback } from "react-rnd";
import { useViewport } from "#/system/viewport.ts";
import type { System } from "#/system/types.ts";
import { useInstance } from "#/system/process/hooks.ts";

export function useWindowRnd(pid: string) {
  const viewport = useViewport();
  const _size = useInstance(pid, (state) => state.window.size);

  const [size, setSize] = useState<System.Window.Size>(_size);
  const [position, setPosition] = useState<System.Window.Position>(() => ({
    x: viewport.width / 2 - size.width / 2,
    y: (viewport.height - 32) / 2 - size.height / 2,
  }));

  const onDragChange: RndDragCallback = useCallback((_1, data) => {
    setPosition({ x: data.x, y: data.y });
  }, []);

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

  return { size, position, onDragChange, onResizeChange };
}
