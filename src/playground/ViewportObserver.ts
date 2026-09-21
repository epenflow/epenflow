import { useSyncExternalStore } from "react";

import { throttle } from "@tanstack/react-pacer";
import { hasWindow } from "#/lib/utils.ts";
import type { Systems } from "#/lib/types.ts";
import { VIEWPORT_SERVER_SIZE } from "#/lib/constants.ts";

export class ViewportObserver {
  private observer: ResizeObserver | null = null;
  private listeners: Set<VoidFunction> = new Set<VoidFunction>();
  private snapshot: Systems.Window.Size;
  private static instance: ViewportObserver | null = null;

  private readonly notify = throttle(
    () => {
      for (const listener of this.listeners) {
        listener();
      }
    },
    {
      wait: 250,
      key: "notify-viewport-observer",
    },
  );

  constructor() {
    this.snapshot = this.compute();

    if (ViewportObserver.instance) {
      return ViewportObserver.instance;
    }

    ViewportObserver.instance = this;
  }

  private attach(): void {
    if (this.observer || !hasWindow() || !window.ResizeObserver) return;

    this.observer = new ResizeObserver(this.notify);
    this.observer.observe(document.documentElement);
  }

  private detach(): void {
    this.observer?.disconnect();
    this.observer = null;
  }

  private compute(): Systems.Window.Size {
    if (hasWindow()) {
      return {
        width: window.innerWidth,
        height: window.innerHeight,
      };
    }

    return this.getServerSnapshot();
  }

  public getServerSnapshot = (): Systems.Window.Size => VIEWPORT_SERVER_SIZE;

  public subscribe = (callback: VoidFunction): VoidFunction => {
    this.attach();
    this.listeners.add(callback);

    return () => {
      this.listeners.delete(callback);
      if (this.listeners.size === 0) {
        this.detach();
      }
    };
  };

  public getSnapshot = (): Systems.Window.Size => {
    const snapshot = this.compute();

    if (this.snapshot.width === snapshot.width && this.snapshot.height === snapshot.height) {
      return this.snapshot;
    }

    this.snapshot = snapshot;

    return this.snapshot;
  };

  public clear(): void {
    this.listeners.clear();
    this.detach();
  }

  static getInstance() {
    return (this.instance ??= new ViewportObserver());
  }
}

export const viewportObserver = ViewportObserver.getInstance();

export function useViewportObserver(): Systems.Window.Size {
  return useSyncExternalStore(
    viewportObserver.subscribe,
    viewportObserver.getSnapshot,
    viewportObserver.getServerSnapshot,
  );
}
