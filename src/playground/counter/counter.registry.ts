import { lazy } from "react";

export default function (registry: ProcessRegistry) {
  registry.register({
    id: "Counter",
    component: lazy(() => import("./counter")),
    title: "counter",
    window: {
      size: { width: 400, height: 400 },
    },
  });
}
