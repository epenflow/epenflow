import { createLazyFileRoute } from "@tanstack/react-router";
import Under from "~/pages/under";

export const Route = createLazyFileRoute(
  "/consecutive-scroll-animations-with-one-element",
)({
  component: Under,
});
