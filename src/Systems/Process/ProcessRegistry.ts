import type { Systems } from "#/lib/types.ts";

export class processRegistrySingleton {
  private static instance: processRegistrySingleton | null = null;
  private readonly definitions = new Map<
    Systems.Process.Identifier,
    Systems.Process.Definition<Systems.Process.Identifier>
  >();
  private cached: ReadonlyArray<any> | null = null;

  constructor() {
    if (processRegistrySingleton.instance) {
      return processRegistrySingleton.instance;
    }
    processRegistrySingleton.instance = this;
  }

  public register(definition: Systems.Process.Definition<Systems.Process.Identifier>): void {
    if (definition.id == null) {
      throw new Error("[processRegistry]: definition.id is required");
    }

    this.definitions.set(definition.id, definition);
    this.cached = null;
  }

  public unregister(id: Systems.Process.Identifier): boolean {
    const deleted = this.definitions.delete(id);

    if (deleted) {
      this.cached = null;
    }

    return deleted;
  }

  public registerMany(
    definitions: ReadonlyArray<Systems.Process.Definition<Systems.Process.Identifier>>,
  ): void {
    for (const definition of definitions) {
      this.register(definition);
    }
  }

  public get(
    id: Systems.Process.Identifier,
  ): Systems.Process.Definition<Systems.Process.Identifier> | undefined {
    return this.definitions.get(id);
  }

  public has(id: Systems.Process.Identifier): boolean {
    return this.definitions.has(id);
  }

  public getOrThrow(
    id: Systems.Process.Identifier,
  ): Systems.Process.Definition<Systems.Process.Identifier> {
    const definition = this.get(id);

    if (definition == null) {
      throw new Error(`[processRegistry]: no process is registered for ${id}`);
    }

    return definition;
  }

  public getMany(): ReadonlyArray<Systems.Process.Definition<Systems.Process.Identifier>> {
    if (this.cached == null) {
      this.cached = Object.freeze([...this.definitions.values()]);
    }

    return this.cached;
  }

  public clear(): void {
    this.definitions.clear();
    this.cached = null;
  }

  public async initialize() {
    const modules = import.meta.glob<{ default?: (registry: processRegistrySingleton) => void }>(
      "/src/**/*.registry.{ts,tsx}",
      { eager: true },
    );

    for (const path in modules) {
      const module = modules[path];

      if (typeof module.default === "function") {
        module.default(this);
      }
    }
    console.info(`[processRegistry]: Initialized ${this.definitions.size} processes.`);
  }

  static getInstance(): processRegistrySingleton {
    return (this.instance ??= new processRegistrySingleton());
  }
}

export const processRegistry = processRegistrySingleton.getInstance();
export const processRegistryGetMany = processRegistry.getMany.bind(processRegistry);
export const processRegistryRegisterMany = processRegistry.registerMany.bind(processRegistry);
