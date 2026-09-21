import { useSelector, type UseSelectorOptions } from "@tanstack/react-store";
import { ProcessStore } from "#/Systems/Process/ProcessStore.ts";
import type { Systems } from "#/lib/types.ts";

export const useProcessSelector = <T>(
  selector: (snapshot: Systems.Process.Store) => T,
  options?: UseSelectorOptions<T>,
) => useSelector(ProcessStore, selector, options);

export const useProcesses = (): Systems.Process.Instance[] =>
  useProcessSelector((state) => state.orders.map((id) => state.processes[id]).filter(Boolean));

export const useProcessZIndex = (pid: string) =>
  useProcessSelector((state) => state.orders.indexOf(pid));
export const useProcessFocused = (pid: string) => useProcessSelector((state) => state.pid === pid);

export function useProcess(pid: string): Systems.Process.Instance;
export function useProcess<T>(pid: string, selector: (process: Systems.Process.Instance) => T): T;
export function useProcess<T>(
  pid: string,
  selector?: (process: Systems.Process.Instance) => T,
): Systems.Process.Instance | T {
  return useProcessSelector((state) => {
    const process = state.processes[pid];

    if (!process) {
      throw new Error(`No process with current [pid:${pid}] was found`);
    }

    return selector ? selector(process) : process;
  });
}
