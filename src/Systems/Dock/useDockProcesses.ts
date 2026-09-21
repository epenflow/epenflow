import { useMemo } from "react";

import { useProcesses, useProcessSelector } from "#/Systems/Process/useProcess.ts";
import { ProcessRegistry } from "#/Systems/Process/ProcessRegistry.ts";
import type { Systems } from "#/lib/types.ts";
import { WINDOW_VALUES } from "#/lib/constants.ts";

export function useDockProcesses() {
  const processes = useProcesses();
  const pid = useProcessSelector((state) => state.pid);

  return useMemo((): Systems.Dock.Process[] => {
    const instances = new Map<Systems.Process.Identifier, Systems.Process.Instance[]>();

    for (const process of processes) {
      let instance = instances.get(process.id);

      if (!instance) {
        instance = [];
        instances.set(process.id, instance);
      }
      instance.push(process);
    }

    const createDockItem = (id: Systems.Process.Identifier): Systems.Dock.Process => {
      const definition = ProcessRegistry.get(id);
      const instance = instances.get(id) ?? [];

      const current = instance.find((current) => current.pid === pid);
      const next = current ?? instance.at(-1) ?? null;

      return {
        id,
        title: definition?.title ?? id,
        pid: next?.pid ?? null,
        running: instance.length > 0,
        focused: next?.pid === pid,
        minimized: next?.window.minimized ?? WINDOW_VALUES.minimized,
        closed: next?.window.closed ?? WINDOW_VALUES.closed,
        maximized: next?.window.maximized ?? WINDOW_VALUES.maximized,
        singleton: definition?.singleton ?? false,
        count: instance.length,
      };
    };

    const definitions = ProcessRegistry.getMany().filter((definition) => definition.pinned);
    const entries = new Set(definitions.map((definition) => definition.id));

    const running = [...instances.entries()]
      .filter(([id]) => !entries.has(id))
      .sort(
        ([, a], [, b]) =>
          Math.min(...a.map((instance) => instance.createdAt)) -
          Math.min(...b.map((instance) => instance.createdAt)),
      )
      .map(([id]) => id);

    return [
      ...definitions.map((definition) => createDockItem(definition.id)),
      ...running.map(createDockItem),
    ];
  }, [processes, pid]);
}
