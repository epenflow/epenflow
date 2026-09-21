import { useLayoutEffect, useState, useSyncExternalStore } from "react";

import type { Systems } from "#/lib/types.ts";

const DOCK_PRESENCES_SERVER_SNAPSHOT: Systems.Dock.Presence[] = [];
function createDockPresences(processes: Systems.Dock.Process[]) {
  let last = processes;
  let current = processes.map((process) => ({ ...process, completed: false }));

  const listeners = new Set<VoidFunction>();

  const setState = (updater: (prev: Systems.Dock.Presence[]) => Systems.Dock.Presence[]) => {
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
    sync: (next: Systems.Dock.Process[]) => {
      if (last === next) return;
      last = next;

      setState((prev) => {
        const entries = new Set(next.map((item) => item.id));
        const result: Systems.Dock.Presence[] = next.map((item) => ({
          ...item,
          completed: false,
        }));

        let id: Systems.Process.Identifier | null = null;

        for (const item of prev) {
          if (entries.has(item.id)) {
            id = item.id;
            continue;
          }

          const ghost = item.completed ? item : { ...item, completed: true };
          const index = id === null ? 0 : result.findIndex((entry) => entry.id === id) + 1;

          result.splice(index, 0, ghost);

          id = ghost.id;
        }

        return result;
      });
    },
    onComplete: (id: Systems.Process.Identifier) => {
      setState((prev) => {
        const next = prev.filter((item) => item.id !== id || !item.completed);
        return next.length === prev.length ? prev : next;
      });
    },
  };
}

export function useDockPresences(processes: Systems.Dock.Process[]) {
  const [store] = useState(() => createDockPresences(processes));

  const snapshot = useSyncExternalStore(
    store.subscribe,
    store.getSnapshot,
    store.getServerSnapshot,
  );

  useLayoutEffect(() => {
    store.sync(processes);
  }, [store, processes]);

  return [snapshot, store.onComplete] as const;
}
