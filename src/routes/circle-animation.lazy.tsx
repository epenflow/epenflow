import { createLazyFileRoute } from "@tanstack/react-router";
import Page from "~/pages/circle-animation";

export const Route = createLazyFileRoute("/circle-animation")({
  component: Page,
});
