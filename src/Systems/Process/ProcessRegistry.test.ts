import { processRegistrySingleton } from "#/Systems/Process/processRegistry.ts";
import type { Systems } from "#/lib/types.ts";

interface MockProcessDefinition extends Systems.Process.Definition<string> {
  id: string;
}

const definition: MockProcessDefinition = {
  id: "process-1",
  title: "process-1",
  component: () => null,
};

const definitions: MockProcessDefinition[] = [
  { id: "process-1", title: "process-1", component: () => null },
  { id: "process-2", title: "process-2", component: () => null },
  { id: "process-3", title: "process-3", component: () => null },
];

describe("processRegistry", () => {
  let registry: processRegistrySingleton;
  beforeAll(() => {
    registry = processRegistrySingleton.getInstance();
  });

  beforeEach(() => {
    registry.clear();
  });

  describe("singleton instantiation", () => {
    it("it must return the same instance when called multiple times via getInstance()", () => {
      const first = processRegistrySingleton.getInstance();
      const second = processRegistrySingleton.getInstance();

      expect(first).toBe(second);
    });

    it("a safety constructor must always return the same instance when called with 'new'", () => {
      const first = processRegistrySingleton.getInstance();
      const second = new processRegistrySingleton();

      expect(first).toBe(second);
    });
  });

  describe("core operations: register & get", () => {
    it("must register and retrieve the definition based on id", () => {
      registry.register(definition);
      expect(registry.has("process-1")).toBe(true);
      expect(registry.get("process-1")).toEqual(definition);
    });

    it("must display an error message if a definition is registered without id", () => {
      const invalid = { title: "process-1" } as unknown as MockProcessDefinition;

      expect(() => registry.register(invalid)).toThrow(
        "[processRegistry]: definition.id is required",
      );
    });

    it("getOrThrow must return definition if exist", () => {
      registry.register(definition);

      expect(registry.getOrThrow("process-1")).toEqual(definition);
    });

    it("getOrThrow must throw an error if it attempts to access an unregistered id", () => {
      expect(() => registry.getOrThrow("process-1")).toThrow(
        "[processRegistry]: no process is registered for process-1",
      );
    });
  });

  describe("batch operations", () => {
    it("registerMany must be able to register multiple definitions at once", () => {
      registry.registerMany(definitions);

      expect(registry.has("process-1")).toBe(true);
      expect(registry.has("process-2")).toBe(true);
      expect(registry.has("process-3")).toBe(true);
    });
  });

  describe("unregister", () => {
    it("must delete definition dan return true if id found", () => {
      registry.register(definition);
      expect(registry.has(definition.id)).toBe(true);

      const deleted = registry.unregister(definition.id);
      expect(deleted).toBe(true);
      expect(registry.has("process")).toBe(false);
    });

    it("must return false if attempts to delete an unregistered id", () => {
      const deleted = registry.unregister("non-existent");
      expect(deleted).toBe(false);
    });
  });

  describe("cache management", () => {
    it("must create a cache when getMany() is called", () => {
      registry.register(definition);

      const first = registry.getMany();
      const second = registry.getMany();

      expect(first).toBe(second);
    });

    it("must invalidate the cache when the register is called", () => {
      registry.register(definitions[0]);
      const first = registry.getMany();

      registry.register(definitions[1]);
      const second = registry.getMany();

      expect(first).not.toBe(second);
      expect(second.length).toBe(2);
    });

    it("must invalidate the cache when unregister call is successful", () => {
      registry.register(definitions[0]);
      registry.register(definitions[1]);

      const first = registry.getMany();

      registry.unregister("process-1");
      const second = registry.getMany();
      expect(first).not.toBe(second);
      expect(second.length).toBe(1);
    });

    it("cannot perform cache invalidation if unregister fails", () => {
      registry.register(definition);
      const first = registry.getMany();

      registry.unregister("non-existent");
      const second = registry.getMany();

      expect(first).toBe(second);
    });
  });
});
