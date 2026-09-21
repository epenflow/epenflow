import { Store } from "@tanstack/react-store";
import { ProcessRegistry } from "#/Systems/Process/ProcessRegistry.ts";
import type { Systems } from "#/lib/types.ts";
import { PID_DELIMITER, PROCESS_STORE_VALUES, WINDOW_VALUES } from "#/lib/constants.ts";

function createProcessPID(id: string, data: ReadonlySet<string> | ReadonlyArray<string>): string {
  const prefix = `${id}${PID_DELIMITER}`;
  const existing = data instanceof Set ? data : new Set(data);

  let attempt = 0;

  while (existing.has(`${prefix}${attempt}`)) {
    attempt++;
  }

  return `${prefix}${attempt}`;
}
function findById(
  processes: Record<string, Systems.Process.Instance>,
  id: Systems.Process.Identifier,
): Systems.Process.Instance<Systems.Process.Identifier> | undefined {
  return Object.values(processes).find((process) => process.id === id);
}

function updateProcessWindow(
  pid: string,
  processes: Record<string, Systems.Process.Instance>,
  updater: (state: Systems.Window.State) => Systems.Window.State,
): Systems.Process.Processes {
  const current = processes[pid].window;

  if (!current) return processes;

  const next = updater(current);

  return {
    ...processes,
    [pid]: {
      ...processes[pid],
      window: next,
    },
  };
}

function findVisiblePID(
  pid: string,
  processes: Record<string, Systems.Process.Instance>,
  orders: string[],
): string | null {
  return (
    [...orders].reverse().find((id) => {
      if (id === pid) return false;

      const window = processes[id].window;
      return !window.closed && !window.minimized;
    }) ?? null
  );
}

export const ProcessStore = new Store<Systems.Process.Store, Systems.Process.Actions>(
  PROCESS_STORE_VALUES,
  ({ setState, get }) => ({
    open: (id) => {
      const definition = ProcessRegistry.getOrThrow(id);
      const state = get();

      if (definition.singleton) {
        const existing = findById(state.processes, id);
        if (existing) {
          ProcessStore.actions.focus(existing.pid);
          return existing.pid;
        }
      }

      const prefix = `${id}${PID_DELIMITER}`;
      const existing = Object.keys(state.processes).filter((process) => process.startsWith(prefix));
      const pid = createProcessPID(id, existing);

      const def = definition.window ?? {};
      const mode = def.mode ?? WINDOW_VALUES.mode ?? "default";

      let window: Systems.Window.State;

      if (mode === "sidebar" || mode === "unified") {
        window = {
          mode,
          component: "component" in def ? def.component : undefined,
          closed: def.closed ?? WINDOW_VALUES.closed,
          maximized: def.maximized ?? WINDOW_VALUES.maximized,
          minimized: def.minimized ?? WINDOW_VALUES.minimized,
          resizable: def.resizable ?? WINDOW_VALUES.resizable,
          size: def.size ?? WINDOW_VALUES.size,
        } as Systems.Window.State;
      } else {
        window = {
          mode: "default",
          closed: def.closed ?? WINDOW_VALUES.closed,
          maximized: def.maximized ?? WINDOW_VALUES.maximized,
          minimized: def.minimized ?? WINDOW_VALUES.minimized,
          resizable: def.resizable ?? WINDOW_VALUES.resizable,
          size: def.size ?? WINDOW_VALUES.size,
          variants: def.variants ?? WINDOW_VALUES.variants,
        } as Systems.Window.State;
      }

      const process: Systems.Process.Instance = {
        id,
        pid,
        title: definition.title,
        createdAt: Date.now(),
        window: window,
      };

      setState((current) => ({
        ...current,
        processes: {
          ...current.processes,
          [pid]: process,
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
          const processes = updateProcessWindow(pid, current.processes, (previous) => ({
            ...previous,
            closed: true,
          }));

          if (processes === current.processes) return current;

          return {
            ...current,
            pid:
              current.pid === pid
                ? findVisiblePID(pid, current.processes, current.orders)
                : current.pid,
            processes,
          };
        });
        return;
      }

      setState((current) => {
        if (!current.processes[pid]) return current;

        const { [pid]: _removed, ...processes } = current.processes;

        return {
          ...current,
          processes,
          orders: current.orders.filter((id) => id !== pid),
          pid:
            current.pid === pid
              ? findVisiblePID(pid, current.processes, current.orders)
              : current.pid,
        };
      });
    },
    minimize: (pid, forced) => {
      setState((current) => {
        const processes = updateProcessWindow(pid, current.processes, (previous) => ({
          ...previous,
          minimized: forced ?? !previous.minimized,
        }));

        if (current.processes === processes) return current;
        const minimized = !!processes[pid].window.minimized;
        return {
          ...current,
          pid:
            minimized && current.pid === pid
              ? findVisiblePID(pid, current.processes, current.orders)
              : current.pid,
          processes,
        };
      });
    },
    maximize: (pid, forced) => {
      setState((current) => {
        const processes = updateProcessWindow(pid, current.processes, (previous) => ({
          ...previous,
          maximized: forced ?? !previous.maximized,
        }));

        if (current.processes === processes) return current;

        return { ...current, processes };
      });
    },
    focus: (pid) => {
      setState((current) => {
        if (!current.processes[pid]) return current;

        const focused = current.pid === pid;
        const first = current.orders[current.orders.length - 1] === pid;

        if (first && focused) return current;

        return {
          ...current,
          pid,
          orders: [...current.orders.filter((id) => id !== pid), pid],
        };
      });
    },
    blur: () => {
      setState((current) => ({ ...current, pid: null }));
    },
  }),
);
