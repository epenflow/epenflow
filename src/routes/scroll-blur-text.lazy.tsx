import { createLazyFileRoute } from "@tanstack/react-router";
import Page from "~/pages/scroll-blur-text";

export const Route = createLazyFileRoute("/scroll-blur-text")({
  component: Page,
});
