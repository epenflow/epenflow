import { createLazyFileRoute } from "@tanstack/react-router";
import Page from "~/pages/loader-fx1";

export const Route = createLazyFileRoute("/loader-fx1")({
  component: Page,
});
