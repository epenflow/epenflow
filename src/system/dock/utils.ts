import type { System } from "#/system/types.ts";
import { DOCK_PRESENCES_SERVER_SNAPSHOT } from "#/system/constants.ts";

export const DockDOM = {
  assign: <T>(value: T) => ({ "data-dock": value }),
  query: <T, H extends HTMLElement>(value: T): H | null =>
    document.querySelector<H>(`[data-dock="${value}"]`),
  selector: <T>(value: T) => `[data-dock="${value}"]`,
};

export function createDockPresences(instances: System.Dock.Instance[]) {
  let last = instances;
  let current = instances.map((process) => ({ ...process, completed: false }));

  const listeners = new Set<VoidFunction>();

  const setState = (updater: (prev: System.Dock.Presence[]) => System.Dock.Presence[]) => {
    const next = updater(current);

    if (current === next) return;

    current = next;

    for (const listener of listeners) {
      listener();
    }
  };

  return {
    getSnapshot: () => current,
    getServerSnapshot: () => DOCK_PRESENCES_SERVER_SNAPSHOT,
    subscribe: (callback: VoidFunction) => {
      listeners.add(callback);

      return () => listeners.delete(callback);
    },
    sync: (next: System.Dock.Instance[]) => {
      if (last === next) return;
      last = next;

      setState((prev) => {
        const identifiers = new Set(next.map((item) => item.id));
        const presences: System.Dock.Presence[] = next.map((item) => ({
          ...item,
          completed: false,
        }));

        let id: System.Process.Id | null = null;

        for (const item of prev) {
          if (identifiers.has(item.id)) {
            id = item.id;
            continue;
          }

          const ghost = item.completed ? item : { ...item, completed: true };
          const index = id === null ? 0 : presences.findIndex((entry) => entry.id === id) + 1;

          presences.splice(index, 0, ghost);

          id = ghost.id;
        }

        return presences;
      });
    },
    onComplete: (id: System.Process.Id) => {
      setState((prev) => {
        const next = prev.filter((item) => item.id !== id || !item.completed);
        return next.length === prev.length ? prev : next;
      });
    },
  };
}
