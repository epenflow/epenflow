import { createRouter } from "@tanstack/react-router";

import { routeTree } from "~/routeTree.gen";

function router() {
  return createRouter({
    routeTree,
  });
}

export default router;

declare module "@tanstack/react-router" {
  interface Register {
    router: ReturnType<typeof router>;
  }
}
