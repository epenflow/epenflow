import type { ComponentType } from "react";

import type { JSONValue } from "es-toolkit/types";

export namespace System {
  export interface Registries {}

  export type Registry = import("#/system/process/registry.ts").ProcessRegistry;

  export type Processes = Record<string, Process.Instance<Process.Id>>;

  export interface Module {
    default?: (registry: Registry) => void;
  }

  export namespace Dock {
    export interface Instance
      extends Process.Base<Process.Id>, Pick<Window.State, "closed" | "maximized" | "minimized"> {
      icon?: ComponentType<any>;
      pid: string | null;
      focused: boolean;
      running: boolean;
      singleton: boolean;
      count: number;
    }

    export interface Presence extends Instance {
      completed: boolean;
    }
  }

  export namespace Window {
    export interface Size {
      width: number;
      height: number;
    }

    export interface Position {
      x: number;
      y: number;
    }

    export interface State {
      size: Size;
      resizable: boolean;
      closed: boolean;
      maximized: boolean;
      minimized: boolean;
    }
  }
  export namespace Desktop {}

  export interface Definition<T extends Process.Id = Process.Id> extends Process.Base<T> {
    component: ComponentType<Process.ComponentProps>;
    window?: Partial<Window.State>;
    singleton?: boolean;
    pinned?: boolean;
  }

  export namespace Process {
    export type Id = keyof Registries extends never ? string : keyof Registries | (string & {});
    export type SequenceId<T extends Id = Id> = {
      id: T;
      sequence: number;
    };

    export interface Base<T extends Id = Id> {
      id: T;
      title: string;
    }

    export interface ComponentProps {
      pid: string;
    }

    export interface Instance<T extends Id = Id> extends Base<T> {
      pid: string;
      window: Window.State;
      createdAt: number;
    }

    export interface Store {
      processes: Processes;
      pid: string | null;
      orders: string[];
    }

    export type Actions = {
      open(id: Id): string;
      close(pid: string, forced?: boolean): void;
      minimize(pid: string, forced?: boolean): void;
      maximize(pid: string, forced?: boolean): void;
      focus(pid: string): void;
      blur(): void;
    };

    export type ActionName = keyof Actions;
  }

  export namespace Devtools {
    export type Tab = "actions" | "state" | "processes";

    export type Outcome<T> =
      | { readonly status: "success"; readonly value: T }
      | { readonly status: "error"; readonly error: unknown };

    export interface EntryOf<K extends Process.ActionName> {
      readonly id: number;
      readonly name: K;
      readonly args: Parameters<Process.Actions[K]>;
      readonly at: number;
      readonly duration: number;
      readonly before: Process.Store;
      readonly after: Process.Store;
      readonly changed: boolean;
      readonly outcome: Outcome<ReturnType<Process.Actions[K]>>;
    }

    export type Entry = { [K in Process.ActionName]: EntryOf<K> }[Process.ActionName];

    export interface FieldChange {
      path: string;
      from: JSONValue;
      to: JSONValue;
    }

    export interface ProcessChange {
      pid: string;
      fields: FieldChange[];
    }

    export interface Diff {
      pid: {
        from: string | null;
        to: string | null;
      } | null;
      orders: boolean;
      added: string[];
      removed: string[];
      changed: ProcessChange[];
    }

    export interface State {
      readonly entries: ReadonlyArray<Entry>;
      readonly paused: boolean;
    }

    export interface Target {
      state: Process.Store;
      actions: Process.Actions;
    }
  }
}
