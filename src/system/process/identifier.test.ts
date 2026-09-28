import { beforeEach, describe, expect, it } from "vitest";
import { identifier, ProcessIdentifier } from "#/system/process/identifier.ts";

describe("ProcessIdentifier", () => {
  beforeEach(() => {
    identifier.dispose();
  });

  describe("Singleton Pattern", () => {
    it("should return the exact same instance every time", () => {
      const instance = new (ProcessIdentifier as any)();
      const instance1 = ProcessIdentifier.instance();

      expect(instance1).toBe(instance);
      expect(instance1).toBe(identifier);
    });
  });

  describe("Allocation", () => {
    it("should allocate PIDs starting from 0 for a new id", () => {
      expect(identifier.allocate("app")).toBe("app::0");
      expect(identifier.allocate("app")).toBe("app::1");
      expect(identifier.allocate("app")).toBe("app::2");
    });

    it("should track different ids independently", () => {
      expect(identifier.allocate("terminal")).toBe("terminal::0");
      expect(identifier.allocate("browser")).toBe("browser::0");
      expect(identifier.allocate("terminal")).toBe("terminal::1");
      expect(identifier.allocate("browser")).toBe("browser::1");
    });
  });

  describe("Release & Caching (Pool)", () => {
    it("should reuse the lowest released sequence number", () => {
      identifier.allocate("calc");
      identifier.allocate("calc");
      identifier.allocate("calc");

      identifier.release("calc::2");
      identifier.release("calc::0");

      expect(identifier.allocate("calc")).toBe("calc::0");

      expect(identifier.allocate("calc")).toBe("calc::2");

      expect(identifier.allocate("calc")).toBe("calc::3");
    });

    it("should safely ignore invalid PIDs during release", () => {
      identifier.allocate("notepad");

      identifier.release("invalid-format");
      identifier.release("notepad::not-a-number");
      identifier.release("notepad::");

      expect(identifier.allocate("notepad")).toBe("notepad::1");
    });

    it("should handle release of an ID that has never been allocated before", () => {
      identifier.release("ghost::5");

      expect(identifier.allocate("ghost")).toBe("ghost::5");

      expect(identifier.allocate("ghost")).toBe("ghost::0");
    });
  });

  describe("Sync (Devtools)", () => {
    it("should reconstruct counter and cached gaps from valid process identifiers", () => {
      identifier.sync(["app::0", "app::2", "app::4"]);

      expect(identifier.allocate("app")).toBe("app::1");
      expect(identifier.allocate("app")).toBe("app::3");

      expect(identifier.allocate("app")).toBe("app::5");
      expect(identifier.allocate("app")).toBe("app::6");
    });

    it("should set counter correctly when there are no gaps (continuous)", () => {
      identifier.sync(["app::0", "app::1", "app::2"]);

      expect(identifier.allocate("app")).toBe("app::3");
    });

    it("should handle multiple process identifiers concurrently during sync", () => {
      identifier.sync(["app::0", "app::2", "calc::1"]);

      expect(identifier.allocate("app")).toBe("app::1");
      expect(identifier.allocate("app")).toBe("app::3");

      expect(identifier.allocate("calc")).toBe("calc::0");
      expect(identifier.allocate("calc")).toBe("calc::2");
    });

    it("should gracefully ignore invalid process identifiers and only sync valid ones", () => {
      identifier.sync(["app::0", "app::not-a-number", "app::2", "invalid-format"]);

      expect(identifier.allocate("app")).toBe("app::1");
      expect(identifier.allocate("app")).toBe("app::3");
    });

    it("should act as dispose if synced with an empty iterable", () => {
      identifier.allocate("app");
      identifier.allocate("app");

      identifier.sync([]);

      expect(identifier.allocate("app")).toBe("app::0");
    });

    it("should accept any iterable (like Set)", () => {
      const pids = new Set(["browser::0", "browser::2"]);
      identifier.sync(pids);

      expect(identifier.allocate("browser")).toBe("browser::1");
      expect(identifier.allocate("browser")).toBe("browser::3");
    });
  });

  describe("Dispose", () => {
    it("should clear all counters and cached sequences", () => {
      identifier.allocate("settings");
      identifier.release("settings::0");

      identifier.dispose();

      expect(identifier.allocate("settings")).toBe("settings::0");

      expect(identifier.allocate("settings")).toBe("settings::1");
    });
  });
});
