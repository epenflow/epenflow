import { processRegistrySingleton } from "#/Systems/Process/processRegistry.ts";
import type { Systems } from "#/lib/types.ts";

function createDefinitions(amount: number = 100) {
  const definitions: Systems.Process.Definition<string>[] = [];

  for (let i = 0; i < amount; i++) {
    definitions.push({ id: `process-${i}`, title: `process-${i}`, component: () => null });
  }

  return definitions;
}
const definitions = createDefinitions(5000);

const definition: Systems.Process.Definition<string> = {
  id: "temp",
  title: "temp",
  component: () => null,
};

describe("processRegistry - Performance Benchmarks", () => {
  let registry: processRegistrySingleton;

  beforeAll(() => {
    registry = processRegistrySingleton.getInstance();
  });

  beforeEach(() => {
    registry.clear();
  });

  test("cache performance compare", ({ bench }) => {
    registry.registerMany(definitions);

    bench.compare(
      bench("uncached getMany() - rebuilding array", () => {
        registry.register(definition);
        registry.getMany();
      }),
      bench("cached getMany() - returning cached array", () => {
        registry.getMany();
      }),
    );
  });

  test(`single read performance (lookups in ${definitions.length} items)`, ({ bench }) => {
    registry.registerMany(definitions);

    bench.compare(
      bench("has() - check existence", () => {
        registry.has("process-2500");
      }),
      bench("get() - retrieve object", () => {
        registry.get("process-2500");
      }),
      bench("getOrThrow - retrieve with validation error check", () => {
        registry.getOrThrow("process-2500");
      }),
    );
  });

  test("write performance (insertions)", ({ bench }) => {
    bench("register() - single insertion", () => {
      registry.register(definition);
    }).run();

    bench(`registerMany() - batch insertion ${definitions.length}`, () => {
      registry.clear();
      registry.registerMany(definitions);
    }).run();
  });

  test("worst-case scenario (cache churn / trashing)", ({ bench }) => {
    registry.registerMany(definitions);

    bench("interleaved ops (register() -> getMany() -> unregister() -> getMany())", () => {
      registry.register(definition);
      registry.getMany();
      registry.unregister(definition.id);
      registry.getMany();
    }).run();
  });
});
