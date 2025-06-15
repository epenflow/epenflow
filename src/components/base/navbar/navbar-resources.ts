import type { FileRouteTypes } from "~/routeTree.gen";

type NavbarList = {
  label: string;
  to: FileRouteTypes["to"];
};

const NAVBAR_LISTS: NavbarList[] = [
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
  {
    label: "Scroll Blur Text",
    to: "/scroll-blur-text",
  },
  {
    label: "Loader FX1",
    to: "/loader-fx1",
  },
  {
    label: "Scroll Blur Text",
    to: "/scroll-blur-text",
  },
  {
    label: "Loader FX1",
    to: "/loader-fx1",
  },
  {
    label: "Scroll Blur Text",
    to: "/scroll-blur-text",
  },
  {
    label: "Loader FX1",
    to: "/loader-fx1",
  },
  {
    label: "Scroll Blur Text",
    to: "/scroll-blur-text",
  },
  {
    label: "Loader FX1",
    to: "/loader-fx1",
  },
];

export default {
  NAVBAR_LISTS,
};
