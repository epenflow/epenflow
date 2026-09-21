import type { Systems } from "#/lib/types.ts";

export const PID_DELIMITER = "::";

export const TOPBAR_HEIGHT = 32 + 0.5;
export const DOCK_HEIGHT = 65.6 + 8 + 0.5;
export const DOCK_ANCHOR = "dock-anchor-";
export const DOCK_SIZE = 48;
export const PROCESS_STORE_VALUES: Systems.Process.Store = {
  processes: Object.create(null),
  pid: null,
  orders: [],
};

export const VIEWPORT_SERVER_SIZE: Systems.Window.Size = {
  width: 1920,
  height: 1080,
};

export const WINDOW_VALUES: Systems.Window.State = {
  size: {
    width: 250,
    height: 300,
  },
  closed: false,
  minimized: false,
  maximized: false,
  resizable: true,
  mode: "default",
  variants: {
    root: "default",
    header: "default",
  },
};
