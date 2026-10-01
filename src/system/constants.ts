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

export const DOCK_PRESENCES_SERVER_SNAPSHOT: System.Dock.Presence[] = [] as const;
export const DOCK_MAGNIFY_SCALE = 1.6;
export const DOCK_ENGAGE_SHOW_DELAY = 120;
export const DOCK_ENGAGE_HIDE_DELAY = 320;
export const DOCK_ITEM_SIZE = 48;
export const DOCK_ITEM_GAP = 8;
export const DOCK_ITEM_ENTER_DURATION = 0.35;
export const DOCK_ITEM_EXIT_DURATION = 0.3;
export const DOCK_ITEM_BOUNCE_COUNT = 3;
export const DOCK_ITEM_BOUNCE_HEIGHT = DOCK_ITEM_SIZE * 0.5;
export const DOCK_ITEM_BOUNCE_HALF_DURATION = 0.26;
export const DOCK_GROUP_STYLE = {
  "--gap": `${DOCK_ITEM_GAP}px`,
  "--size": `${DOCK_ITEM_SIZE}px`,
} as CSSProperties;
