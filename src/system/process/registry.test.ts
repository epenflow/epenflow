import { afterEach, beforeEach, describe, expect, it, vi, type Mock } from "vitest";
import { ProcessRegistry, registry } from "./registry";
import type { System } from "#/system/types";

const Component = () => null;

describe("ProcessRegistry", () => {
  const app1: System.Definition = {
    id: "calculator",
    title: "Calculator",
    component: Component,
  };

  const app2: System.Definition = {
    id: "terminal",
    title: "Terminal",
    component: Component,
  };

  beforeEach(() => {
    registry.dispose();
  });

  describe("Singleton Pattern", () => {
    it("should return the exact same instance every time", () => {
      const instance1 = ProcessRegistry.instance();
      const instance = new (ProcessRegistry as any)();
      expect(instance).toBe(instance1);
      expect(instance).toBe(registry);
    });
  });

  describe("Registration & Retrieval", () => {
    it("should register and retrieve a process definition", () => {
      registry.register(app1);

      expect(registry.has("calculator")).toBe(true);
      expect(registry.get("calculator")).toEqual(app1);
    });

    it("should register multiple definitions using registerMany", () => {
      registry.registerMany([app1, app2]);

      expect(registry.has("calculator")).toBe(true);
      expect(registry.has("terminal")).toBe(true);
      expect(registry.getMany().length).toBe(2);
    });

    it("should throw an error if registering a definition without an ID", () => {
      const invalid: System.Definition = {
        id: "",
        title: "No ID App",
        component: Component,
      };

      expect(() => registry.register(invalid)).toThrow(/definition.id is required/);
    });

    it("should return undefined for non-existent process via get()", () => {
      expect(registry.get("ghost-app")).toBeUndefined();
    });

    it("should throw an error for non-existent process via getOrThrow()", () => {
      expect(() => registry.getOrThrow("ghost-app")).toThrow(/no process is registered/);
    });

    it("getOrThrow should return definition if exist", () => {
      registry.register(app1);

      expect(registry.getOrThrow("calculator")).toEqual(app1);
    });
  });

  describe("Unregistration", () => {
    it("should remove a registered process and return true", () => {
      registry.register(app1);
      expect(registry.has("calculator")).toBe(true);

      const result = registry.unregister("calculator");

      expect(result).toBe(true);
      expect(registry.has("calculator")).toBe(false);
    });

    it("should return false when trying to unregister a non-existent process", () => {
      const result = registry.unregister("non-existent");
      expect(result).toBe(false);
    });
  });

  describe("Caching Mechanism", () => {
    it("should cache the definitions array on first getMany() call", () => {
      registry.register(app1);
      registry.register(app2);

      expect(registry.getMany()).toBe(registry.getMany());
    });

    it("should invalidate cache when a new process is registered", () => {
      registry.register(app1);

      const before = registry.getMany();

      registry.register(app2);

      const after = registry.getMany();

      expect(after).not.toBe(before);
      expect(after.length).toBe(2);
    });

    it("should invalidate cache when a process is unregistered", () => {
      registry.register(app1);
      const before = registry.getMany();

      registry.unregister("calculator");

      const after = registry.getMany();

      expect(after).not.toBe(before);
      expect(after.length).toBe(0);
    });
  });

  describe("Initialization & Disposal", () => {
    let log: Mock<Console["log"]>;
    let warn: Mock<Console["warn"]>;

    beforeEach(() => {
      log = vi.spyOn(console, "log").mockImplementation(() => {});
      warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    });

    afterEach(() => {
      log.mockRestore();
      warn.mockRestore();
    });

    it("should run initialize without crashing", () => {
      expect(() => registry.initialize()).not.toThrow();
      expect(log).toHaveBeenCalledWith(expect.stringContaining("initialized"));
    });

    it("should warn (or throw) when a module is missing a default export", () => {
      const modules = {
        "src/counter.registry.ts": {},
      };

      registry.initialize(modules);
      expect(warn).toHaveBeenCalledWith(
        expect.stringContaining(
          "Module at src/counter.registry.ts is missing a default export function.",
        ),
      );
    });

    it("should completely clear all data on dispose()", () => {
      registry.register(app1);
      registry.getMany();

      registry.dispose();

      expect(registry.has("calculator")).toBe(false);
      expect(registry.getMany()).toEqual([]);
    });
  });
});
