import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/test")({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/test"!</div>;
}
