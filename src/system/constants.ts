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
export const DOCK_ITEM_Z_INDEX = 100;
export const DOCK_GROUP_STYLE = {
  "--gap": `${DOCK_ITEM_GAP}px`,
  "--size": `${DOCK_ITEM_SIZE}px`,
  "--zIndex": DOCK_ITEM_Z_INDEX,
} as CSSProperties;

export const GENIE_EASE_LUT_SIZE = 256;
export const GENIE_EPSILON = 1e-6;
export const GENIE_MAX_STRIP = 1000;
export const GENIE_MAX_ANISOTROPY = 8;
export const GENIE_PIXEL_RATIO = [1, 2] as const;
export const GENIE_KICKOFF_ORIGIN = "50% 100%" as const;
export const GENIE_TO_SIZE: System.Window.Size = {
  width: DOCK_ITEM_SIZE,
  height: DOCK_ITEM_SIZE,
};
export const GENIE_DEFAULTS = {
  duration: 420,
  strip: 500,
  kickoffDuration: 0.12,
  xProgressDelay: 0.65,
  yProgressDelay: 0.2,
  xAxisEasing: "power2.inOut",
  yAxisEasing: "power1.in",
  kickoffEasing: "power1.out",
  kickoffScale: 0.97,
  kickoffOpacity: 0.92,
  enableTextureCache: false,
  enableErrorLogging: true,
  mipmaps: true,
  antialias: true,
  pinchShading: 0.18,
} as const satisfies Partial<System.Genie.Options>;
export const GENIE_CAPTURE_STYLE = {
  boxShadow: "none",
  border: "none",
  margin: "0",
  transform: "none",
  translate: "none",
  opacity: "1",
  top: "0",
  left: "0",
  right: "auto",
  bottom: "auto",
} as const satisfies Partial<CSSStyleDeclaration>;
