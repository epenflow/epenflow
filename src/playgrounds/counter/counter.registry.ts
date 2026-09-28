import { lazy } from "react";

import type { System } from "#/system/types.ts";

export default function (registry: System.Registry) {
  registry.register({
    id: "Counter",
    title: "Counter",
    component: lazy(() => import("./counter")),
  });
}
