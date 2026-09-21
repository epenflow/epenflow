import type { ComponentType } from "react";

export namespace Systems {
  export namespace Dock {
    export interface Process
      extends
        Pick<Window.State, "closed" | "maximized" | "minimized">,
        Process.Base<Process.Identifier> {
      icon?: ComponentType<any>;
      pid: string | null;
      focused: boolean;
      running: boolean;
      singleton: boolean;
      count: number;
    }
    export interface Presence extends Process {
      completed: boolean;
    }
  }

  export namespace Window {
    export type Size = { height: number; width: number };
    export type Position = { y: number; x: number };

    export type AppearanceVariant = "default" | "light" | "prominent";
    export type HeaderVariant = "default" | "light" | "prominent";
    export type Mode =
      | {
          mode: "default";
        }
      | {
          mode: "unified";
          component?: ComponentType<Process.ComponentProps>;
        }
      | {
          mode: "sidebar";
          component: ComponentType<Process.ComponentProps>;
        };

    export type State = Mode & {
      size: Size;
      maximized: boolean;
      minimized: boolean;
      resizable: boolean;
      closed: boolean;
      variants?: Partial<{
        root: AppearanceVariant;
        header: HeaderVariant;
      }>;
    };
  }
  export namespace Process {
    export interface Registries {}
    export type Identifier = keyof Registries extends never
      ? string
      : keyof Registries | (string & {});

    export type ComponentProps = { pid: string };

    export interface Base<T extends Identifier = Identifier> {
      id: T;
      title: string;
    }

    export interface Definition<T extends Identifier = Identifier> extends Base<T> {
      component: ComponentType<ComponentProps>;
      window?: Partial<Window.State>;
      singleton?: boolean;
      pinned?: boolean;
    }

    export interface Instance<T extends Identifier = Identifier> extends Base<T> {
      pid: string;
      window: Window.State;
      createdAt: number;
    }

    export type Processes = Record<string, Instance>;

    export interface Store {
      processes: Processes;
      pid: string | null;
      orders: string[];
    }

    export type Actions = {
      open(id: Identifier): string;
      focus(pid: string): void;
      close(pid: string, forced?: boolean): void;
      blur(): void;
      maximize(pid: string, forced?: boolean): void;
      minimize(pid: string, forced?: boolean): void;
      closeProcesses(processes: Processes, forced?: boolean): void;
    };
  }
}
