import { createLazyFileRoute } from "@tanstack/react-router";
import Under from "~/pages/under";

export const Route = createLazyFileRoute(
  "/on-scroll-expanding-image-animation-within-typography",
)({
  component: Under,
});
