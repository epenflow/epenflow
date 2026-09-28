import { useCallback, type PointerEvent } from "react";

import { Topbar } from "#/system/topbar/index.ts";
import { blur, open } from "#/system/process/store.ts";
import { Loader } from "#/system/process/loader.tsx";
import { Dock } from "#/system/dock/index.ts";
import { DesktopPrimitive } from "#/system/desktop/primitive.tsx";

export function Desktop() {
  const onPointerDown = useCallback((event: PointerEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) {
      blur();
    }
  }, []);

  return (
    <DesktopPrimitive>
      <Topbar />
      <DesktopPrimitive.Viewport onPointerDown={onPointerDown}>
        <p>render app</p>
        <button onClick={() => open("Counter")}>open counter</button>
        <button onClick={() => open("Hello")}>open hello</button>
        <Loader />
      </DesktopPrimitive.Viewport>
      <Dock />
    </DesktopPrimitive>
  );
}
