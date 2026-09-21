import type { Systems } from "#/lib/types.ts";

export class ProcessRegistrySingleton {
  private static instance: ProcessRegistrySingleton | null = null;
  private readonly definitions = new Map<
    Systems.Process.Identifier,
    Systems.Process.Definition<Systems.Process.Identifier>
  >();
  private cached: ReadonlyArray<any> | null = null;

  constructor() {
    if (ProcessRegistrySingleton.instance) {
      return ProcessRegistrySingleton.instance;
    }
    ProcessRegistrySingleton.instance = this;
  }

  public register(definition: Systems.Process.Definition<Systems.Process.Identifier>): void {
    if (definition.id == null) {
      throw new Error("[ProcessRegistry]: definition.id is required");
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
      throw new Error(`[ProcessRegistry]: no process is registered for ${id}`);
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

  static getInstance(): ProcessRegistrySingleton {
    return (this.instance ??= new ProcessRegistrySingleton());
  }
}

export const ProcessRegistry = ProcessRegistrySingleton.getInstance();
export const ProcessRegistryGetMany = ProcessRegistry.getMany.bind(ProcessRegistry);
export const ProcessRegistryRegisterMany = ProcessRegistry.registerMany.bind(ProcessRegistry);
