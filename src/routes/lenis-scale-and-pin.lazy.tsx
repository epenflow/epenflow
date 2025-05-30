import { createLazyFileRoute } from "@tanstack/react-router";
import Page from "~/pages/lenis-scale-and-pin";

export const Route = createLazyFileRoute("/lenis-scale-and-pin")({
  component: Page,
});
