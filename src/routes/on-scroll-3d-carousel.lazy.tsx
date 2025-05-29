import { createLazyFileRoute } from "@tanstack/react-router";
import Under from "~/pages/under";

export const Route = createLazyFileRoute("/on-scroll-3d-carousel")({
  component: Under,
});
