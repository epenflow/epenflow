import { useMemo } from "react";

import { useSelector, type UseSelectorOptions } from "@tanstack/react-store";

import type { System } from "#/system/types.ts";
import { store } from "#/system/process/store.ts";

export const useProcessSelector = <T>(
  selector?: (snapshot: System.Process.Store) => T,
  options?: UseSelectorOptions<T>,
): T => useSelector(store, selector, options);

export const useProcesses = (): System.Processes => useProcessSelector((state) => state.processes);
export const useProcessStack = (pid: string) =>
  useProcessSelector((state) => state.orders.indexOf(pid));
export const useProcessFocusable = (pid: string) =>
  useProcessSelector((state) => state.pid === pid);

export const useInstances = (): System.Process.Instance<System.Process.Id>[] =>
  useProcessSelector((state) => state.orders.map((id) => state.processes[id]).filter(Boolean));

export function useInstance(pid: string): System.Process.Instance;
export function useInstance<T>(pid: string, selector: (snapshot: System.Process.Instance) => T): T;
export function useInstance<T>(
  pid: string,
  selector?: (snapshot: System.Process.Instance) => T,
): T | System.Process.Instance {
  return useProcessSelector((state) => {
    const instance = state.processes[pid];

    if (!instance) {
      throw new Error(`[${useInstance.name}]: No process with current [pid:${pid}] was found.`);
    }

    return selector ? selector(instance) : instance;
  });
}

export function useHasMaximizedInstances() {
  const instances = useInstances();

  return useMemo(
    () =>
      instances.some(
        (instance) =>
          instance.window.maximized && !instance.window.minimized && !instance.window.closed,
      ),
    [instances],
  );
}
