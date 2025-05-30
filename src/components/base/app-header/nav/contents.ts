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
    label: "On-Scroll 3D Carousel",
    to: "/on-scroll-3d-carousel",
  },
  {
    label: "Consecutive Scroll Animations with One Element",
    to: "/consecutive-scroll-animations-with-one-element",
  },
  {
    label: "Blurry Text Reveal on Scroll",
    to: "/blurry-text-reveal-on-scroll",
  },
  {
    label: "Some On-Scroll Text Highlight Animations",
    to: "/some-on-scroll-text-highlight-animations",
  },
  {
    label: "On-Scroll Expanding Image Animation within Typography",
    to: "/on-scroll-expanding-image-animation-within-typography",
  },
] satisfies Array<Content>;
