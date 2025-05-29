import { createLazyFileRoute } from "@tanstack/react-router";
import Under from "~/pages/under";

export const Route = createLazyFileRoute(
  "/some-on-scroll-text-highlight-animations",
)({
  component: Under,
});
