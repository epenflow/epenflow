import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { act, renderHook } from "@testing-library/react";
import { useViewportObserver, viewportObserver } from "#/playground/ViewportObserver.ts";
import { hasWindow } from "#/lib/utils.ts";
import { VIEWPORT_SERVER_SIZE } from "#/lib/constants.ts";

vi.mock("#/lib/utils.ts", () => ({
  hasWindow: vi.fn(),
}));

let notify: VoidFunction | null = null;
const observe = vi.fn();
const disconnect = vi.fn();
const unobserve = vi.fn();

class MockResizeObserver {
  constructor(callback: VoidFunction) {
    notify = callback;
  }
  observe = observe;
  disconnect = disconnect;
  unobserve = unobserve;
}

vi.stubGlobal("ResizeObserver", MockResizeObserver);

describe("useViewportObserver & ViewportObserverSingleton", () => {
  const vw = window.innerWidth;
  const vh = window.innerHeight;

  const MOCK_CLIENT_WIDTH = 1024;
  const MOCK_CLIENT_HEIGHT = 768;

  beforeEach(() => {
    vi.clearAllMocks();
    notify = null;

    vi.mocked(hasWindow).mockReturnValue(true);

    Object.defineProperty(window, "innerWidth", {
      writable: true,
      configurable: true,
      value: MOCK_CLIENT_WIDTH,
    });
    Object.defineProperty(window, "innerHeight", {
      writable: true,
      configurable: true,
      value: MOCK_CLIENT_HEIGHT,
    });
  });

  afterEach(() => {
    Object.defineProperty(window, "innerWidth", {
      writable: true,
      configurable: true,
      value: vw,
    });
    Object.defineProperty(window, "innerHeight", {
      writable: true,
      configurable: true,
      value: vh,
    });

    viewportObserver.clear();
  });

  describe("useViewportObserver Hook", () => {
    it("must render the dimensions from the snapshot server during SSR (hasWindow = false)", () => {
      vi.mocked(hasWindow).mockReturnValue(false);

      const { result } = renderHook(() => useViewportObserver());

      expect(result.current).toEqual(VIEWPORT_SERVER_SIZE);
    });

    it("must render client window dimensions directly during CSR (hasWindow = true)", () => {
      vi.mocked(hasWindow).mockReturnValue(true);

      const { result } = renderHook(() => useViewportObserver());

      expect(result.current).toEqual({
        width: MOCK_CLIENT_WIDTH,
        height: MOCK_CLIENT_HEIGHT,
      });
    });

    it("must update the value when resized (the ResizeObserver notify() is triggered)", () => {
      const { result } = renderHook(() => useViewportObserver());

      expect(result.current).toEqual({
        width: MOCK_CLIENT_WIDTH,
        height: MOCK_CLIENT_HEIGHT,
      });

      const width = 1280;
      const height = 720;

      window.innerWidth = width;
      window.innerHeight = height;

      act(() => {
        if (notify) notify();
      });

      expect(result.current).toEqual({ width: width, height: height });
    });

    it("must attach an observer when mounting and call disconnect when everything is unmounted", () => {
      const first = renderHook(() => useViewportObserver());
      expect(observe).toHaveBeenCalledTimes(1);

      const second = renderHook(() => useViewportObserver());
      expect(observe).toHaveBeenCalledTimes(1);

      first.unmount();
      expect(disconnect).not.toHaveBeenCalled();

      second.unmount();
      expect(disconnect).toHaveBeenCalledTimes(1);
    });
  });

  describe("optimization & structural equality", () => {
    it("must return the exact same object reference if dimensions haven't changed", () => {
      const first = viewportObserver.getSnapshot();
      const second = viewportObserver.getSnapshot();

      expect(first).toBe(second);
    });

    it("must return a new object reference only when dimensions actually change", () => {
      const first = viewportObserver.getSnapshot();

      window.innerWidth = 800;
      window.innerHeight = 600;
      const second = viewportObserver.getSnapshot();

      expect(first).not.toBe(second);
      expect(second).toEqual({ width: 800, height: 600 });

      window.innerWidth = 800;
      window.innerHeight = 600;
      const third = viewportObserver.getSnapshot();

      expect(second).toBe(third);
    });
  });
});
