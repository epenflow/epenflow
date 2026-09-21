import { lazy } from "react";

import { ProcessRegistryRegisterMany } from "#/Systems/Process/ProcessRegistry.ts";
import type { Systems } from "#/lib/types.ts";

export default function processRegistryInit() {
  function createProcesses(): Systems.Process.Definition<Systems.Process.Identifier>[] {
    return [
      {
        id: "app-default",
        title: "Calculator (Default)",
        component: lazy(() => import("#/playground/counter/counter")),
        pinned: false,
        singleton: true,
        window: {
          mode: "default",
          size: { width: 320, height: 420 },
          maximized: false,
          minimized: false,
          resizable: true,
          closed: false,
        },
      },
      {
        id: "Notes",
        title: `Personal Note`,
        component: lazy(() => import("#/playground/Notes")),
        singleton: true,
        window: {
          size: {
            width: 520,
            height: 480,
          },
        },
      },
      {
        id: "app-sidebar",
        title: "Finder (Sidebar Layout)",
        component: lazy(() => import("#/playground/counter/counter")),
        pinned: true,
        singleton: true,
        window: {
          mode: "sidebar",
          variants: {
            header: "light",
            root: "light",
          },
          component: () => (
            <div className="space-y-2 p-3">
              <p className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
                Favorites
              </p>
              <div className="space-y-1">
                <div className="bg-accent text-accent-foreground cursor-pointer rounded-md px-2 py-1 text-xs font-medium">
                  Applications
                </div>
                <div className="hover:bg-accent/50 cursor-pointer rounded-md px-2 py-1 text-xs">
                  Desktop
                </div>
                <div className="hover:bg-accent/50 cursor-pointer rounded-md px-2 py-1 text-xs">
                  Documents
                </div>
              </div>
            </div>
          ),
          size: { width: 550, height: 480 },
          maximized: false,
          minimized: false,
          resizable: true,
          closed: false,
        },
      },
      {
        id: "app-unified",
        title: "Browser (Unified Toolbar)",
        component: lazy(() => import("#/playground/counter/counter")),
        pinned: false,
        singleton: true,
        window: {
          mode: "unified",
          component: () => (
            <div className="border-border bg-background z-10 flex w-full max-w-xs items-center rounded-md border px-2.5 py-1 text-xs shadow-inner">
              <span className="text-muted-foreground truncate">https://example.com</span>
            </div>
          ),
          size: { width: 480, height: 550 },
          maximized: false,
          minimized: false,
          resizable: true,
          closed: false,
        },
      },
    ];
  }

  const processes = createProcesses();
  ProcessRegistryRegisterMany(processes);
}
