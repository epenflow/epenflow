import { useCallback, useRef, type PropsWithChildren } from "react";

import { Rnd } from "react-rnd";
import { useWindowRnd } from "#/system/window/hooks.ts";
import type { System } from "#/system/types.ts";
import { close, focus, maximize, minimize } from "#/system/process/index.ts";
import { useProcessFocusable, useProcessStack } from "#/system/process/hooks.ts";
import { Portal } from "#/components/portal.tsx";

export function ProtoWindow({ children, pid }: PropsWithChildren & System.Process.ComponentProps) {
  const rndRef = useRef<Rnd>(null);
  const zIndex = useProcessStack(pid);
  const focused = useProcessFocusable(pid);

  const { size, position, onDragChange, onResizeChange, onAttachCanvasRef, fromRef } =
    useWindowRnd(pid);

  const onFocus = useCallback(
    (event: globalThis.PointerEvent | globalThis.MouseEvent) => {
      if (!focused) {
        focus(pid);
      }
    },
    [pid, focused],
  );

  return (
    <>
      <Rnd
        ref={rndRef}
        bounds="parent"
        cancel="[data-dragging='none']"
        style={{ zIndex }}
        position={position}
        size={size}
        onDragStop={onDragChange}
        onResizeStop={onResizeChange}
        onMouseDown={onFocus}>
        <div ref={fromRef} className="bg-card border-border size-full border">
          <p className="text-2xl font-medium">{pid}</p>
          <div data-dragging="none" className="inline-flex items-center gap-1">
            <button
              className="bg-foreground text-primary-foreground rounded-xl p-1"
              onClick={() => close(pid, true)}>
              close
            </button>
            <button
              onClick={() => minimize(pid)}
              className="bg-foreground text-primary-foreground rounded-xl p-1">
              minimize
            </button>
            <button
              className="bg-foreground text-primary-foreground rounded-xl p-1"
              onClick={() => maximize(pid)}>
              maximize
            </button>
          </div>

          {children}
        </div>
      </Rnd>
      <Portal
        render={
          <canvas
            ref={onAttachCanvasRef}
            aria-hidden={true}
            style={{ zIndex }}
            className="pointer-events-none fixed inset-0 isolate overflow-clip rounded-xl"
          />
        }
      />
    </>
  );
}
