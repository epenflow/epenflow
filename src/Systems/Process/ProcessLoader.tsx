import { Suspense } from "react";

import { Window } from "#/Systems/Window/index.ts";
import { useProcesses } from "#/Systems/Process/useProcess.ts";
import { ProcessRegistry } from "#/Systems/Process/ProcessRegistry.ts";

export function ProcessLoader() {
  const processes = useProcesses();

  return processes.map((process) => {
    const definition = ProcessRegistry.get(process.id);
    if (!definition) return;

    return (
      <Suspense key={process.pid}>
        <Window {...process}>
          <definition.component pid={process.id} />
        </Window>
      </Suspense>
    );
  });
}
