import { isEmpty } from "es-toolkit/compat";
import type { System } from "#/system/types.ts";

/**
 *
 */
export class ProcessRegistry {
  #cached: ReadonlyArray<System.Definition<System.Process.Id>> | null = null;
  readonly #definitions: Map<System.Process.Id, System.Definition<System.Process.Id>> = new Map();
  static #instance: ProcessRegistry | null = null;

  private constructor() {
    if (ProcessRegistry.#instance) {
      return ProcessRegistry.#instance;
    }
    ProcessRegistry.#instance = this;
  }

  /**
   *
   * @param {System.Definition<System.Process.Id>} definition
   * @returns {void}
   */
  public register(definition: System.Definition<System.Process.Id>): void {
    if (isEmpty(definition.id)) {
      throw new Error(`[${ProcessRegistry.name}]: definition.id is required.`);
    }

    this.#definitions.set(definition.id, definition);
    this.#cached = null;
  }
  /**
   *
   * @param {ReadonlyArray<System.Definition<System.Process.Id>>} definitions
   * @returns {void}
   */
  public registerMany(definitions: ReadonlyArray<System.Definition<System.Process.Id>>): void {
    for (const definition of definitions) {
      this.register(definition);
    }
  }
  /**
   *
   * @param {System.Process.Id} id
   * @returns {boolean}
   */
  public unregister(id: System.Process.Id): boolean {
    const result = this.#definitions.delete(id);

    if (result) {
      this.#cached = null;
    }

    return result;
  }
  /**
   *
   * @param {System.Process.Id} id
   * @returns {boolean}
   */
  public has(id: System.Process.Id): boolean {
    return this.#definitions.has(id);
  }
  /**
   *
   * @param {System.Process.Id} id
   * @returns {System.Definition<System.Process.Id> | undefined }
   */
  public get(id: System.Process.Id): System.Definition<System.Process.Id> | undefined {
    return this.#definitions.get(id);
  }

  /**
   *
   * @param {System.Process.Id} id
   * @returns {System.Definition<System.Process.Id>}
   */
  public getOrThrow(id: System.Process.Id): System.Definition<System.Process.Id> {
    const definition = this.#definitions.get(id);

    if (definition == null) {
      throw new Error(`[${ProcessRegistry.name}]: no process is registered for ${id}.`);
    }

    return definition;
  }

  /**
   *
   * @returns {ReadonlyArray<System.Definition<System.Process.Id>>}
   */
  public getMany(): ReadonlyArray<System.Definition<System.Process.Id>> {
    if (this.#cached == null) {
      this.#cached = Object.freeze([...this.#definitions.values()]);
    }

    return this.#cached;
  }
  /**
   * @param {Record<string,System.Module> | undefined} [modules]
   * @returns {void}
   */
  public initialize(
    modules: Record<string, System.Module> = import.meta.glob<System.Module>(
      "/src/**/*.registry.{ts,tsx}",
      {
        eager: true,
      },
    ),
  ): void {
    for (const path in modules) {
      const module = modules[path];

      if (typeof module.default === "function") {
        module.default(this);
      } else {
        console.warn(
          `[${ProcessRegistry.name}]: Module at ${path} is missing a default export function.`,
        );
      }
    }

    console.log(`[${ProcessRegistry.name}]: initialized ${this.#definitions.size} processes.`);
  }
  /**
   * @returns {void}
   */
  public dispose(): void {
    this.#definitions.clear();
    this.#cached = null;
  }
  /**
   *
   * @returns {ProcessRegistry}
   */
  static instance(): ProcessRegistry {
    return (this.#instance ??= new ProcessRegistry());
  }
}

export const registry = ProcessRegistry.instance();
