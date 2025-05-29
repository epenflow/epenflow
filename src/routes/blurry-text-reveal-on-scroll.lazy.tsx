import { createLazyFileRoute } from "@tanstack/react-router";
import Under from "~/pages/under";

export const Route = createLazyFileRoute("/blurry-text-reveal-on-scroll")({
  component: Under,
});
