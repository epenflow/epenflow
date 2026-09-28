import { take } from "es-toolkit";
import type { System } from "#/system/types.ts";

// type Writetable<T> = { -readonly [K in keyof T]: T[K] };
// type Loose = (...args: unknown[]) => unknown;

export class ProcessRecorder {
  static readonly #LIMIT = 200;
  static #instance: ProcessRecorder | null = null;

  #depth: number = 0;
  #counter: number = 0;
  #state: System.Devtools.State = { entries: [], paused: false };

  readonly #listeners: Set<VoidFunction> = new Set<VoidFunction>();
  // readonly #wrapped: WeakSet<object> = new WeakSet<object>();

  private constructor() {}

  /**
   *
   * @param {VoidFunction} listener
   * @returns {VoidFunction}
   */
  public readonly subscribe = (listener: VoidFunction): VoidFunction => {
    this.#listeners.add(listener);

    return () => {
      this.#listeners.delete(listener);
    };
  };

  /**
   *
   * @returns {ReadonlyArray<System.Devtools.State>}
   */
  public readonly getSnapshot = (): System.Devtools.State => this.#state;

  /**
   *
   * @returns {void}
   */
  public readonly clear = (): void => {
    if (this.#state.entries.length === 0) return;
    this.#set({ ...this.#state, entries: [] });
  };

  /**
   *
   * @param {boolean} paused
   * @returns {void}
   */
  public readonly setPaused = (paused: boolean): void => {
    if (this.#state.paused === paused) return;
    this.#set({ ...this.#state, paused });
  };

  /**
   *
   * @param {System.Devtools.Target} target
   * @returns {VoidFunction}
   */
  public instrument(target: System.Devtools.Target): VoidFunction {
    // const actions = target.actions as Writable<System.Process.Actions>;
    // const restores: VoidFunction[] = [];

    // for (const name of Object.keys(actions) as System.Process.ActionName[]) {
    //   const restore = this.#patch(target, actions, name);
    //   if (restore) restores.push(restore);
    // }

    // return () => {
    //   for (const restore of restores) {
    //     restore();
    //   }
    // };
    const actions = target.actions;

    target.actions = new Proxy(actions, {
      get: (next, prop, receiver) => {
        const original = Reflect.get(next, prop, receiver);

        if (typeof original !== "function") return original;

        return (...args: unknown[]) => {
          if (this.#depth > 0 || this.#state.paused) return Reflect.apply(original, next, args);

          const before = target.state;
          const start = performance.now();
          this.#depth++;
          try {
            const value = Reflect.apply(original, next, args);
            this.#record(prop as System.Process.ActionName, args, before, target.state, start, {
              status: "success",
              value,
            });
            return value;
          } catch (error) {
            this.#record(prop as System.Process.ActionName, args, before, target.state, start, {
              status: "error",
              error,
            });
            throw error;
          } finally {
            this.#depth--;
          }
        };
      },
    });

    return () => {
      target.actions = actions;
    };
  }

  // /**
  //  * @template {System.Process.ActionName} K
  //  * @param {System.Devtools.Target} target
  //  * @param {Writable<System.Process.Actions>} actions
  //  * @param {K} name
  //  * @returns {VoidFunction | null}
  //  */
  // #patch<K extends System.Process.ActionName>(
  //   target: System.Devtools.Target,
  //   actions: Writable<System.Process.Actions>,
  //   name: K,
  // ): VoidFunction | null {
  //   const original = actions[name];
  //   if (this.#wrapped.has(original)) return null;

  //   const call = original as Loose;
  //   const wrapped = ((...args: unknown[]) => {
  //     if (this.#depth > 0 || this.#state.paused) return call(...args);

  //     const before = target.state;
  //     const start = performance.now();

  //     this.#depth++;
  //     try {
  //       const value = call(...args);
  //       this.#record(name, args, before, target.state, start, { status: "success", value });
  //     } catch (error) {
  //       this.#record(name, args, before, target.state, start, { status: "error", error });
  //       throw error;
  //     } finally {
  //       this.#depth--;
  //     }
  //   }) as System.Process.Actions[K];

  //   this.#wrapped.add(wrapped);
  //   actions[name] = wrapped;

  //   return () => {
  //     if (actions[name] === wrapped) {
  //       actions[name] = original;
  //     }
  //   };
  // }

  /**
   *
   * @param {System.Process.ActionName} name
   * @param {unknown[]} args
   * @param {System.Process.Store} before
   * @param {System.Process.Store} after
   * @param {number} start
   * @param {System.Devtools.Outcome<unknown>} outcome
   */
  #record(
    name: System.Process.ActionName,
    args: unknown[],
    before: System.Process.Store,
    after: System.Process.Store,
    start: number,
    outcome: System.Devtools.Outcome<unknown>,
  ): void {
    const entry: System.Devtools.Entry = {
      id: this.#counter++,
      name,
      args,
      at: Date.now(),
      duration: performance.now() - start,
      before,
      after,
      changed: before !== after,
      outcome,
    } as System.Devtools.Entry;

    this.#set({
      ...this.#state,
      entries: take([entry, ...this.#state.entries], ProcessRecorder.#LIMIT),
    });
  }

  /**
   *
   * @param {System.Devtools.State} state
   * @returns {void}
   */
  #set(state: System.Devtools.State): void {
    this.#state = state;

    for (const listener of this.#listeners) {
      listener();
    }
  }

  public static instance(): ProcessRecorder {
    return (this.#instance ??= new ProcessRecorder());
  }
}

export const recorder = ProcessRecorder.instance();
