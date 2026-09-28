import { Suspense } from "react";

import { ProtoWindow } from "#/system/window/proto.tsx";
import { registry } from "#/system/process/registry.ts";
import { useInstances } from "#/system/process/hooks.ts";

export function Loader() {
  const instances = useInstances();

  return instances.map((instance) => {
    const definition = registry.getOrThrow(instance.id);

    if (!definition) return null;

    return (
      <Suspense key={instance.pid}>
        <ProtoWindow pid={instance.pid}>
          <definition.component pid={instance.pid} />
        </ProtoWindow>
      </Suspense>
    );
  });
}
