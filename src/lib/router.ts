import { createRouter } from "@tanstack/react-router";
import RoutePending from "~/components/routes/route-pending";

import { routeTree } from "~/routeTree.gen";

export default function router() {
  return createRouter({
    routeTree,
    defaultPreload: "intent",
    defaultPendingComponent: RoutePending,
  });
}

declare module "@tanstack/react-router" {
  interface Register {
    router: ReturnType<typeof router>;
  }
}
