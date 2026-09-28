import { createFileRoute } from "@tanstack/react-router";

import { Desktop } from "#/system/desktop/index.ts";

export const Route = createFileRoute("/")({
  component: Desktop,
});
