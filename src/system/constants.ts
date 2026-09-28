import type { CSSProperties } from "react";

import type { System } from "#/system/types.ts";

export const VIEWPORT_SERVER_SNAPSHOT: System.Window.Size = {
  width: 1920,
  height: 1080,
} as const;

export const PROCESS_ID_DELIMITER = "::" as const;
export const PROCESS_STORE_VALUES: System.Process.Store = {
  processes: {},
  pid: null,
  orders: [],
} as const;

export const WINDOW_STATE_VALUES: System.Window.State = {
  closed: false,
  maximized: false,
  minimized: false,
  resizable: false,
  size: {
    height: 420,
    width: 320,
  },
} as const;

export const TOPBAR_HEIGHT = 32 as const;
export const DOCK_MAGNIFY_SCALE = 1.6 as const;
export const DOCK_MAGNIFY_SIZE = 48 as const;
export const DOCK_ENGAGE_SHOW_DELAY = 120 as const;
export const DOCK_ENGAGE_HIDE_DELAY = 320 as const;
export const DOCK_ITEM_STYLES = {
  "--size": DOCK_MAGNIFY_SIZE + "px",
} as CSSProperties;
