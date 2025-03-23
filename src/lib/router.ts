import { createRouter } from "@tanstack/react-router";
import RoutePending from "~/components/routes/route-pending";

import { routeTree } from "~/routeTree.gen";

function router() {
  return createRouter({
    routeTree,
    defaultPreload: "intent",
    defaultPendingComponent: RoutePending,
  });
}

export default router;

declare module "@tanstack/react-router" {
  interface Register {
    router: ReturnType<typeof router>;
  }
}
