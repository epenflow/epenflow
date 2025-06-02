import type { FileRouteTypes } from "~/routeTree.gen";

type Content = {
  label: string;
  to: FileRouteTypes["to"];
};

export default [
  {
    label: "Home",
    to: "/",
  },
  {
    label: "Hello",
    to: "/hello",
  },
  {
    label: "Test",
    to: "/test",
  },
  {
    label: "Lenis Scale & Pin",
    to: "/lenis-scale-and-pin",
  },
  {
    label: "Circle Animation",
    to: "/circle-animation",
  },
] satisfies Array<Content>;
