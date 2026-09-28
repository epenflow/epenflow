import type { DeepPartial } from "es-toolkit/types";
import { merge } from "es-toolkit/compat";
import { cloneDeep } from "es-toolkit";
import type { System } from "#/system/types.ts";
import { WINDOW_STATE_VALUES } from "#/system/constants.ts";

export function findProcessesInstanceById(
  id: System.Process.Id,
  processes: System.Processes,
): System.Process.Instance<System.Process.Id> | undefined {
  return Object.values(processes).find((process) => process.id === id);
}

export function setProcessesInstanceById(
  id: string,
  processes: System.Processes,
  updater:
    | ((prev: System.Process.Instance) => DeepPartial<System.Process.Instance>)
    | DeepPartial<System.Process.Instance>,
): System.Processes {
  const instance = processes[id];

  if (!instance) return processes;

  const value = typeof updater === "function" ? updater(instance) : updater;

  return {
    ...processes,
    [id]: merge(cloneDeep(instance), value),
  };
}

export function createInstance(
  id: System.Process.Id,
  pid: string,
  definition: System.Definition,
): System.Process.Instance {
  return {
    id,
    pid,
    title: definition.title,
    window: merge(cloneDeep(WINDOW_STATE_VALUES), definition),
    createdAt: Date.now(),
  };
}
export function findVisibleProcessId(
  id: string,
  processes: System.Processes,
  orders: string[],
): string | null {
  return (
    orders.findLast((value) => {
      if (id === value) return false;

      const instance = processes[value];
      if (!instance) return false;

      return !instance.window.closed && !instance.window.minimized;
    }) ?? null
  );
}
