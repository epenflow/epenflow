import { useCallback, type MouseEvent, type PropsWithChildren } from "react";

import { WindowPrimitive } from "#/Systems/Window/WindowPrimitive.tsx";
import { ProcessStore, useProcessFocused } from "#/Systems/Process/index.ts";
import type { Systems } from "#/lib/types.ts";

export type WindowVariant = "default" | "light" | "prominent";
export type HeaderVariant = "default" | "light" | "prominent";

export interface WindowProps
  extends
    Systems.Process.ComponentProps,
    PropsWithChildren,
    Systems.Process.Instance<Systems.Process.Identifier> {
  showControls?: boolean;
}

export function Window({ pid, children, title, window, showControls = true }: WindowProps) {
  const mode = window.mode ?? "default";
  const root = window.variants?.root ?? "default";
  const header = window.variants?.header ?? "default";

  const focused = useProcessFocused(pid);

  const onCloseChange = useCallback(
    (event: MouseEvent<HTMLButtonElement>) => {
      event.preventDefault();
      ProcessStore.actions.close(pid);
    },
    [pid],
  );

  const onMinimizeChange = useCallback(
    (event: MouseEvent<HTMLButtonElement>) => {
      event.preventDefault();
      ProcessStore.actions.minimize(pid);
    },
    [pid],
  );

  const onMaximizeChange = useCallback(
    (event: MouseEvent<HTMLButtonElement>) => {
      event.preventDefault();
      ProcessStore.actions.maximize(pid);
    },
    [pid],
  );

  if (mode === "sidebar") {
    const Component = "component" in window ? window.component : undefined;

    return (
      <WindowPrimitive pid={pid} mode="sidebar" variant={root}>
        <WindowPrimitive.Sidebar>
          <WindowPrimitive.Header variant={header} className="justify-start">
            <WindowPrimitive.Group>
              {showControls && (
                <>
                  <WindowPrimitive.Close onClick={onCloseChange} focused={focused} />
                  <WindowPrimitive.Minimize onClick={onMinimizeChange} focused={focused} />
                  <WindowPrimitive.Maximize onClick={onMaximizeChange} focused={focused} />
                </>
              )}
            </WindowPrimitive.Group>
          </WindowPrimitive.Header>
          <div className="flex-1 scrollbar-thin overflow-y-auto">
            {Component ? <Component pid={pid} /> : null}
          </div>
        </WindowPrimitive.Sidebar>

        <WindowPrimitive.Viewport>
          <WindowPrimitive.Header variant={header} className="border-l border-transparent">
            <WindowPrimitive.Titlebar>{title}</WindowPrimitive.Titlebar>
          </WindowPrimitive.Header>
          {children}
        </WindowPrimitive.Viewport>
      </WindowPrimitive>
    );
  }

  if (mode === "unified") {
    const Component = "component" in window ? window.component : undefined;

    return (
      <WindowPrimitive pid={pid} mode="unified" variant={root}>
        <WindowPrimitive.Header variant={header} className="justify-between px-3">
          <WindowPrimitive.Group className="relative z-10">
            {showControls && (
              <>
                <WindowPrimitive.Close onClick={onCloseChange} focused={focused} />
                <WindowPrimitive.Minimize onClick={onMinimizeChange} focused={focused} />
                <WindowPrimitive.Maximize onClick={onMaximizeChange} focused={focused} />
              </>
            )}
          </WindowPrimitive.Group>
          <div className="flex flex-1 items-center justify-center overflow-hidden">
            {Component ? (
              <Component pid={pid} />
            ) : (
              <WindowPrimitive.Titlebar className="relative inset-auto">
                {title}
              </WindowPrimitive.Titlebar>
            )}
          </div>
          <div className="w-[15.2px] shrink-0" />
        </WindowPrimitive.Header>
        <WindowPrimitive.Viewport data-dragging="none">{children}</WindowPrimitive.Viewport>
      </WindowPrimitive>
    );
  }

  return (
    <WindowPrimitive pid={pid} mode="default" variant={root}>
      <WindowPrimitive.Header variant={header}>
        <WindowPrimitive.Group className="relative z-10">
          {showControls && (
            <>
              <WindowPrimitive.Close onClick={onCloseChange} focused={focused} />
              <WindowPrimitive.Minimize onClick={onMinimizeChange} focused={focused} />
              <WindowPrimitive.Maximize onClick={onMaximizeChange} focused={focused} />
            </>
          )}
        </WindowPrimitive.Group>
        <WindowPrimitive.Titlebar>{title}</WindowPrimitive.Titlebar>
      </WindowPrimitive.Header>
      <WindowPrimitive.Viewport data-dragging="none">{children}</WindowPrimitive.Viewport>
    </WindowPrimitive>
  );
}
