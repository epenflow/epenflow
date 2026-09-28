import { useSyncExternalStore } from "react";

import { isBrowser, isEqual } from "es-toolkit";
import type { System } from "#/system/types.ts";
import { VIEWPORT_SERVER_SNAPSHOT } from "#/system/constants.ts";

export class ViewportObserver {
  static #instance: ViewportObserver | null = null;

  #observer: ResizeObserver | null = null;
  #listeners: Set<VoidFunction> = new Set<VoidFunction>();
  #snapshot: System.Window.Size;

  private constructor() {
    this.#snapshot = this.#compute();
    if (ViewportObserver.#instance) {
      return ViewportObserver.#instance;
    }
    return (ViewportObserver.#instance = this);
  }

  /**
   * @returns {void}
   */
  #emit = (): void => {
    for (const listener of this.#listeners) {
      listener();
    }
  };

  /**
   *
   * @returns {void}
   */
  #attach(): void {
    if (this.#observer || !isBrowser() || !window.ResizeObserver) return;

    this.#observer = new ResizeObserver(this.#emit);
    this.#observer.observe(document.documentElement);
  }

  /**
   * @returns {void}
   */
  #detach(): void {
    this.#observer?.disconnect();
    this.#observer = null;
  }

  /**
   *
   * @returns {System.Window.Size}
   */
  #compute(): System.Window.Size {
    if (isBrowser()) {
      return {
        width: window.innerWidth,
        height: window.innerHeight,
      };
    }

    return this.getServerSnapshot();
  }

  /**
   *
   * @returns {System.Window.Size}
   */
  public readonly getServerSnapshot = (): System.Window.Size => VIEWPORT_SERVER_SNAPSHOT;
  /**
   *
   * @param {VoidFunction} callback
   * @returns {VoidFunction}
   */
  public readonly subscribe = (callback: VoidFunction): VoidFunction => {
    this.#attach();
    this.#listeners.add(callback);

    return () => {
      this.#listeners.delete(callback);
      if (this.#listeners.size === 0) {
        this.#detach();
      }
    };
  };
  /**
   *
   * @returns {System.Window.Size}
   */
  public readonly getSnapshot = (): System.Window.Size => {
    const snapshot = this.#compute();

    if (isEqual(this.#snapshot, snapshot)) {
      return this.#snapshot;
    }

    this.#snapshot = snapshot;
    return this.#snapshot;
  };

  /**
   * @returns {void}
   */
  public dispose(): void {
    this.#listeners.clear();
    this.#detach();
  }

  /**
   *
   * @returns {ViewportObserver}
   */
  static instance(): ViewportObserver {
    return (this.#instance ??= new ViewportObserver());
  }
}
export const viewport = ViewportObserver.instance();

export const useViewport = (): System.Window.Size =>
  useSyncExternalStore(viewport.subscribe, viewport.getSnapshot, viewport.getServerSnapshot);
