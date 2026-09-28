import { Store } from "@tanstack/react-store";

import { last, omit, without } from "es-toolkit";
import type { System } from "#/system/types.ts";
import {
  createInstance,
  findProcessesInstanceById,
  findVisibleProcessId,
  setProcessesInstanceById,
} from "#/system/process/utils.ts";
import { registry } from "#/system/process/registry.ts";
import { identifier } from "#/system/process/identifier.ts";
import { PROCESS_STORE_VALUES } from "#/system/constants.ts";

export const store = new Store<System.Process.Store, System.Process.Actions>(
  PROCESS_STORE_VALUES,
  ({ get, setState }) => ({
    open: (id) => {
      const definition = registry.getOrThrow(id);
      const state = get();

      if (definition.singleton) {
        const instance = findProcessesInstanceById(id, state.processes);

        if (instance) {
          store.actions.minimize(instance.pid, false);
          store.actions.focus(instance.pid);
          return instance.pid;
        }
      }
      const pid = identifier.allocate(id);

      setState((current) => ({
        ...current,
        processes: {
          ...current.processes,
          [pid]: createInstance(id, pid, definition),
        },
        pid: pid,
        orders: [...current.orders, pid],
      }));

      return pid;
    },
    close: (pid, forced) => {
      const process = get().processes[pid];
      if (!process) return;

      const interactive = !forced && !process.window.closed;

      if (interactive) {
        setState((current) => {
          if (current.processes[pid]?.window.closed) return current;

          const processes = setProcessesInstanceById(pid, current.processes, {
            window: {
              closed: true,
            },
          });

          if (current.processes === processes) return current;

          return {
            ...current,
            processes,
            pid:
              current.pid === pid
                ? findVisibleProcessId(pid, processes, current.orders)
                : current.pid,
          };
        });
        return;
      }

      setState((current) => {
        if (!current.processes[pid]) return current;

        const processes = omit(current.processes, [pid]);

        identifier.release(pid);

        return {
          ...current,
          processes,
          orders: without(current.orders, pid),
          pid:
            current.pid === pid
              ? findVisibleProcessId(pid, processes, current.orders)
              : current.pid,
        };
      });
    },
    minimize: (pid, forced) => {
      setState((current) => {
        const instance = current.processes[pid];
        if (!instance) return current;

        const minimized = forced ?? !instance.window.minimized;
        if (instance.window.minimized === minimized) return current;

        const processes = setProcessesInstanceById(pid, current.processes, {
          window: { minimized },
        });

        return {
          ...current,
          processes,
          pid:
            minimized && current.pid === pid
              ? findVisibleProcessId(pid, processes, current.orders)
              : current.pid,
        };
      });
    },
    maximize: (pid, forced) => {
      setState((current) => {
        const processes = setProcessesInstanceById(pid, current.processes, (prev) => ({
          window: {
            maximized: forced ?? !prev.window.maximized,
          },
        }));

        if (current.processes === processes) return current;

        return {
          ...current,
          processes,
        };
      });
    },
    focus: (pid) => {
      setState((current) => {
        if (!current.processes[pid]) return current;

        const focused = current.pid === pid;
        const first = last(current.orders) === pid;

        if (first && focused) return current;

        return {
          ...current,
          pid,
          orders: [...without(current.orders, pid), pid],
        };
      });
    },
    blur: () => {
      setState((current) => ({ ...current, pid: null }));
    },
  }),
);

if (import.meta.env.DEV) {
  const { recorder } = await import("#/system/process/devtools/recorder.ts");
  const restore = recorder.instrument(store);
  import.meta.hot?.dispose(restore);
}

export const { blur, close, focus, maximize, minimize, open } = store.actions;
