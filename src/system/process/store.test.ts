import { beforeEach, describe, expect, it, vi } from "vitest";
import { blur, close, focus, maximize, minimize, open, store } from "./store.ts";
import { registry } from "#/system/process/registry.ts";
import { identifier } from "#/system/process/identifier.ts";
import { PROCESS_STORE_VALUES } from "#/system/constants.ts";

vi.mock("#/system/process/devtools/recorder.ts", () => ({
  recorder: {
    instrument: vi.fn(() => vi.fn()),
  },
}));

const Component = () => null;

describe("Process Store Integration", () => {
  beforeEach(() => {
    store.setState(() => PROCESS_STORE_VALUES);

    registry.dispose();
    identifier.dispose();
  });

  describe("open()", () => {
    it("should open a new process, allocate PID, and set it as active", () => {
      registry.register({ id: "terminal", title: "Terminal", component: Component });

      const pid = open("terminal");
      const state = store.state;

      expect(pid).toBe("terminal::0");
      expect(state.pid).toBe(pid);
      expect(state.orders).toContain(pid);
      expect(state.processes[pid]).toBeDefined();
      expect(state.processes[pid].id).toBe("terminal");
    });

    it("should allow opening multiple instances if NOT a singleton", () => {
      registry.register({ id: "browser", title: "Browser", component: Component });

      const pid1 = open("browser");
      const pid2 = open("browser");

      expect(pid1).toBe("browser::0");
      expect(pid2).toBe("browser::1");
      expect(store.state.orders.length).toBe(2);
      expect(store.state.pid).toBe(pid2);
    });

    it("should refocus and un-minimize an existing instance if it IS a singleton", () => {
      registry.register({
        id: "settings",
        title: "Settings",
        singleton: true,
        component: Component,
      });

      const pid1 = open("settings");

      minimize(pid1, true);
      blur();

      expect(store.state.processes[pid1].window.minimized).toBe(true);
      expect(store.state.pid).toBeNull();

      const pid2 = open("settings");

      expect(pid2).toBe(pid1);
      expect(store.state.processes[pid1].window.minimized).toBe(false);
      expect(store.state.pid).toBe(pid1);
    });
  });

  describe("close()", () => {
    beforeEach(() => {
      registry.register({ id: "app", title: "App", component: Component });
    });

    it("should perform a soft close (interactive) if not forced", () => {
      const pid = open("app");

      close(pid);

      const state = store.state;
      expect(state.processes[pid]).toBeDefined();
      expect(state.processes[pid].window.closed).toBe(true);
      expect(state.orders).toContain(pid);
    });

    it("should perform a hard close if forced", () => {
      const pid = open("app");

      close(pid, true);

      const state = store.state;
      expect(state.processes[pid]).toBeUndefined();
      expect(state.orders).not.toContain(pid);
    });

    it("should perform a hard close if already soft closed", () => {
      const pid = open("app");

      close(pid);
      expect(store.state.processes[pid].window.closed).toBe(true);

      close(pid);
      expect(store.state.processes[pid]).toBeUndefined();
    });

    it("should release PID on hard close", () => {
      const pid = open("app");
      close(pid, true);

      expect(open("app")).toBe("app::0");
    });
  });

  describe("minimize() & maximize()", () => {
    let pid: string;

    beforeEach(() => {
      registry.register({ id: "app", title: "App", component: Component });
      pid = open("app");
    });

    it("should toggle minimize state", () => {
      minimize(pid);
      expect(store.state.processes[pid].window.minimized).toBe(true);

      minimize(pid);
      expect(store.state.processes[pid].window.minimized).toBe(false);
    });

    it("should toggle maximize state", () => {
      maximize(pid);
      expect(store.state.processes[pid].window.maximized).toBe(true);

      maximize(pid);
      expect(store.state.processes[pid].window.maximized).toBe(false);
    });
  });

  describe("focus() & blur()", () => {
    it("should set active pid and move process to the end of orders on focus", () => {
      registry.register({ id: "app1", title: "App 1", component: Component });
      registry.register({ id: "app2", title: "App 2", component: Component });

      const pid1 = open("app1");
      const pid2 = open("app2");

      expect(store.state.pid).toBe(pid2);
      expect(store.state.orders).toEqual([pid1, pid2]);

      focus(pid1);

      expect(store.state.pid).toBe(pid1);
      expect(store.state.orders).toEqual([pid2, pid1]);
    });

    it("should skip state update if process is already focused and at the top", () => {
      registry.register({ id: "app", title: "App", component: Component });
      const pid = open("app");

      const stateBefore = store.state;
      focus(pid);
      const stateAfter = store.state;

      expect(stateBefore).toBe(stateAfter);
    });

    it("should clear active pid on blur", () => {
      registry.register({ id: "app", title: "App", component: Component });
      open("app");

      blur();

      expect(store.state.pid).toBeNull();
    });
  });
});
