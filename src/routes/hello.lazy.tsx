import { createLazyFileRoute } from "@tanstack/react-router";
import Page from "~/pages/hello";

export const Route = createLazyFileRoute("/hello")({
  component: Page,
});
