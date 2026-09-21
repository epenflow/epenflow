import { type MouseEvent, useCallback, useState } from "react";

import { TopbarPrimitive } from "#/Systems/Topbar/TopbarPrimitive.tsx";
import { useProcesses, useProcessSelector } from "#/Systems/Process/useProcess.ts";
import { ProcessStore } from "#/Systems/Process/ProcessStore.ts";
import { Indicator } from "#/components/indicator.tsx";

export function Topbar() {
  const [battery, setBattery] = useState<number>(100);
  const pid = useProcessSelector((state) => state.pid);
  const processes = useProcesses();

  const onMinimizeChange = useCallback(
    (event: MouseEvent<HTMLDivElement>) => {
      event.preventDefault();
      if (!pid) return;

      ProcessStore.actions.minimize(pid);
    },
    [pid],
  );

  const onZoomInChange = useCallback(
    (event: MouseEvent<HTMLDivElement>) => {
      event.preventDefault();
      if (!pid) return;

      ProcessStore.actions.maximize(pid);
    },
    [pid],
  );
  const onCloseProcesses = useCallback(
    (event: MouseEvent<HTMLDivElement>) => {
      event.preventDefault();

      const next = Object.fromEntries(processes.map((process) => [process.pid, process]));
      ProcessStore.actions.closeProcesses(next);
    },
    [processes],
  );

  const disabled = pid == null;
  const maximized = processes.find((process) => process.pid === pid)?.window.maximized ?? false;

  return (
    <TopbarPrimitive>
      <TopbarPrimitive.Left>
        <TopbarPrimitive.Menu>
          <TopbarPrimitive.MenuTrigger render={<TopbarPrimitive.Mark />} />

          <TopbarPrimitive.MenuContent>
            <TopbarPrimitive.MenuItem>About this App</TopbarPrimitive.MenuItem>

            <TopbarPrimitive.MenuSeparator />
            <TopbarPrimitive.MenuItem>Quit</TopbarPrimitive.MenuItem>
          </TopbarPrimitive.MenuContent>
        </TopbarPrimitive.Menu>

        <TopbarPrimitive.Menubar>
          <TopbarPrimitive.Menu>
            <TopbarPrimitive.MenuTrigger>File</TopbarPrimitive.MenuTrigger>
            <TopbarPrimitive.MenuContent>
              <TopbarPrimitive.MenuItem>New Window</TopbarPrimitive.MenuItem>
              <TopbarPrimitive.MenuItem>Open…</TopbarPrimitive.MenuItem>
              <TopbarPrimitive.MenuItem>Save</TopbarPrimitive.MenuItem>
              <TopbarPrimitive.MenuSubmenu>
                <TopbarPrimitive.MenuSubmenuTrigger>Export</TopbarPrimitive.MenuSubmenuTrigger>
                <TopbarPrimitive.MenuSubmenuContent>
                  <TopbarPrimitive.MenuItem>PDF</TopbarPrimitive.MenuItem>
                  <TopbarPrimitive.MenuItem>Markdown</TopbarPrimitive.MenuItem>
                </TopbarPrimitive.MenuSubmenuContent>
              </TopbarPrimitive.MenuSubmenu>
              <TopbarPrimitive.MenuSeparator />
              <TopbarPrimitive.MenuItem>Print…</TopbarPrimitive.MenuItem>
            </TopbarPrimitive.MenuContent>
          </TopbarPrimitive.Menu>

          <TopbarPrimitive.Menu>
            <TopbarPrimitive.MenuTrigger>Edit</TopbarPrimitive.MenuTrigger>
            <TopbarPrimitive.MenuContent>
              <TopbarPrimitive.MenuItem>Undo</TopbarPrimitive.MenuItem>
              <TopbarPrimitive.MenuItem>Redo</TopbarPrimitive.MenuItem>
              <TopbarPrimitive.MenuSeparator />
              <TopbarPrimitive.MenuItem>Cut</TopbarPrimitive.MenuItem>
              <TopbarPrimitive.MenuItem>Copy</TopbarPrimitive.MenuItem>
              <TopbarPrimitive.MenuItem>Paste</TopbarPrimitive.MenuItem>
            </TopbarPrimitive.MenuContent>
          </TopbarPrimitive.Menu>

          <TopbarPrimitive.Menu>
            <TopbarPrimitive.MenuTrigger>Window</TopbarPrimitive.MenuTrigger>
            <TopbarPrimitive.MenuContent>
              <TopbarPrimitive.MenuGroup label="Window">
                <TopbarPrimitive.MenuItem disabled={disabled} onClick={onZoomInChange}>
                  Zoom {maximized ? "out" : "in"}
                </TopbarPrimitive.MenuItem>
                <TopbarPrimitive.MenuItem disabled={disabled} onClick={onMinimizeChange}>
                  Minimize
                </TopbarPrimitive.MenuItem>
                <TopbarPrimitive.MenuItem
                  disabled={processes.length === 0}
                  onClick={onCloseProcesses}>
                  Close Processes
                </TopbarPrimitive.MenuItem>
              </TopbarPrimitive.MenuGroup>
            </TopbarPrimitive.MenuContent>
          </TopbarPrimitive.Menu>

          <TopbarPrimitive.Menu disabled>
            <TopbarPrimitive.MenuTrigger>Help</TopbarPrimitive.MenuTrigger>
          </TopbarPrimitive.Menu>
        </TopbarPrimitive.Menubar>
      </TopbarPrimitive.Left>

      <TopbarPrimitive.Right>
        <TopbarPrimitive.Status>
          <TopbarPrimitive.StatusItem aria-label="Wi-Fi">
            <Indicator.Wifi />
          </TopbarPrimitive.StatusItem>
          <TopbarPrimitive.StatusItem aria-label={`Battery: ${battery}%`}>
            <Indicator.Battery onLevelChange={setBattery} />
          </TopbarPrimitive.StatusItem>
        </TopbarPrimitive.Status>
        <TopbarPrimitive.Item>
          <TopbarPrimitive.Clock />
        </TopbarPrimitive.Item>
      </TopbarPrimitive.Right>
    </TopbarPrimitive>
  );
}
