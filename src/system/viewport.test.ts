import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { isBrowser } from "es-toolkit";
import { act, renderHook } from "@testing-library/react";
import { useViewport, viewport, ViewportObserver } from "#/system/viewport.ts";
import { VIEWPORT_SERVER_SNAPSHOT } from "#/system/constants.ts";

const disconnect = vi.fn();
const observe = vi.fn();
const unobserve = vi.fn();
let resize: VoidFunction = () => {};

const ResizeObserverMock = vi.fn(
  class implements ResizeObserver {
    constructor(callback: ResizeObserverCallback) {
      resize = () => {
        callback([], this);
      };
    }

    disconnect = disconnect;
    observe = observe;
    unobserve = unobserve;
  },
);

vi.mock("es-toolkit", async (module) => {
  const actual = await module<typeof import("es-toolkit")>();

  return {
    ...actual,
    isBrowser: vi.fn(),
  };
});

describe("viewport", () => {
  const vw = 1024;
  const vh = 768;

  beforeEach(() => {
    vi.stubGlobal("ResizeObserver", ResizeObserverMock);
    vi.stubGlobal("innerWidth", vw);
    vi.stubGlobal("innerHeight", vh);
  });

  afterEach(() => {
    viewport.dispose();
    resize = () => {};
    observe.mockClear();
    disconnect.mockClear();
    unobserve.mockClear();
    vi.unstubAllGlobals();
    vi.clearAllMocks();
  });

  describe("ViewportObserver", () => {
    it("should maintain a singleton instance", () => {
      const instance = new (ViewportObserver as any)();
      const instance1 = ViewportObserver.instance();
      expect(instance).toBe(instance1);
      expect(instance).toBe(viewport);
    });

    it("should return the current window dimensions via getSnapshot", () => {
      vi.mocked(isBrowser).mockReturnValue(true);
      expect(viewport.getSnapshot()).toEqual({ width: vw, height: vh });
    });

    it("should maintain object reference (isEqual) if dimensions have not changes", () => {
      const snapshot1 = viewport.getSnapshot();
      const snapshot2 = viewport.getSnapshot();

      expect(snapshot1).toBe(snapshot2);
    });

    it("should update snapshot when dimensions change", () => {
      const snapshot1 = viewport.getSnapshot();
      vi.stubGlobal("innerWidth", 800);
      vi.stubGlobal("innerHeight", 300);

      const snapshot2 = viewport.getSnapshot();
      expect(snapshot1).not.toBe(snapshot2);
      expect(snapshot2).toEqual({ width: 800, height: 300 });
    });

    it("should attach ResizeObserver on subscrbe and detach when all unsubscribed", () => {
      const callback = vi.fn();
      const unsubscribe = viewport.subscribe(callback);

      expect(observe).toHaveBeenCalledWith(document.documentElement);

      unsubscribe();
      expect(disconnect).toHaveBeenCalled();
    });

    it("should trigger listeners when resize occurs", () => {
      vi.mocked(isBrowser).mockReturnValue(true);
      const callback = vi.fn();
      viewport.subscribe(callback);

      resize();
      expect(callback).toHaveBeenCalledTimes(1);
    });

    it("should return the defined server snapshot", () => {
      vi.mocked(isBrowser).mockReturnValue(false);
      expect(viewport.getSnapshot()).toEqual(VIEWPORT_SERVER_SNAPSHOT);
      expect(viewport.getServerSnapshot()).toEqual(VIEWPORT_SERVER_SNAPSHOT);
    });
  });

  describe("useViewport Hook", () => {
    it("should return initial window dimensions", () => {
      vi.mocked(isBrowser).mockReturnValue(true);
      const { result } = renderHook(() => useViewport());

      expect(result.current).toEqual({ width: vw, height: vh });
    });

    it("should update dimensions when viewport is resized", () => {
      const { result } = renderHook(() => useViewport());

      const w = 100;
      const h = 200;

      act(() => {
        vi.stubGlobal("innerWidth", w);
        vi.stubGlobal("innerHeight", h);

        resize();
      });

      expect(result.current).toEqual({ width: w, height: h });
    });

    it("should attach an observer when mounting an call disconnect when everything is unmounted", () => {
      const first = renderHook(() => useViewport());
      expect(observe).toHaveBeenCalledTimes(1);

      const second = renderHook(() => useViewport());
      expect(observe).toHaveBeenCalledTimes(1);

      first.unmount();
      expect(disconnect).not.toHaveBeenCalled();
      second.unmount();
      expect(disconnect).toHaveBeenCalledTimes(1);
    });

    it("should return the dimensions from server snapshot", () => {
      vi.mocked(isBrowser).mockReturnValue(false);

      const { result } = renderHook(() => useViewport());
      expect(result.current).toEqual(VIEWPORT_SERVER_SNAPSHOT);
    });
  });
});
