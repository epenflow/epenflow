import { createLazyFileRoute } from "@tanstack/react-router";
import Page from "~/pages/test";

export const Route = createLazyFileRoute("/test")({
  component: Page,
});
