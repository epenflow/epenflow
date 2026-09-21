import { useCallback } from "react";

import { createFileRoute } from "@tanstack/react-router";
import { Topbar } from "#/Systems/Topbar/index.ts";
import { ProcessStore } from "#/Systems/Process/ProcessStore.ts";
import { ProcessRegistry } from "#/Systems/Process/ProcessRegistry.ts";
import { ProcessLoader } from "#/Systems/Process/ProcessLoader.tsx";
import { useProcesses } from "#/Systems/Process/index.ts";
import { Dock } from "#/Systems/Dock/index.ts";
import { Desktop } from "#/Systems/Desktop/index.ts";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  const processes = useProcesses();

  const onOpenChange = useCallback(
    (id: string) => {
      const instance = processes.find((process) => process.id === id);

      if (!instance) {
        ProcessStore.actions.open(id);
        return;
      }

      if (instance.window.minimized) {
        ProcessStore.actions.minimize(instance.pid, false);
      }

      ProcessStore.actions.focus(instance.pid);
    },
    [processes],
  );

  return (
    <Desktop className="bg-muted">
      <Topbar />
      <Desktop.Viewport>
        <Desktop.Icons onOpenChange={onOpenChange}>
          {ProcessRegistry.getMany().map((process) => (
            <Desktop.Icon key={process.id} value={process.id}>
              <Desktop.Icon.Thumbnail variant="default">
                {process.title.slice(0, 1)}
              </Desktop.Icon.Thumbnail>
              <Desktop.Icon.Label>{process.title}</Desktop.Icon.Label>
            </Desktop.Icon>
          ))}
        </Desktop.Icons>
      </Desktop.Viewport>
      <ProcessLoader />
      <Dock />
    </Desktop>
  );
}
