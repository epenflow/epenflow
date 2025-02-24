import { createRouter } from "@tanstack/react-router";

import Loader from "~/components/layout/loader";
import { routeTree } from "~/routeTree.gen";

function router() {
  return createRouter({
    routeTree,
    defaultPreload: "intent",
    defaultPendingComponent: Loader,
  });
}

export default router;

declare module "@tanstack/react-router" {
  interface Register {
    router: ReturnType<typeof router>;
  }
}
