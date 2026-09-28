import { lazy } from "react";

import type { System } from "#/system/types.ts";

export default function (registry: System.Registry) {
  registry.register({
    id: "Hello",
    title: "Hello",
    component: lazy(() => import("./hello")),
    singleton: true,
  });
}
