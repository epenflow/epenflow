import { createRootRoute } from "@tanstack/react-router";
import RootPage from "~/pages/root-page";

export const Route = createRootRoute({
  component: RootPage,
});
