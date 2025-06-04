import { useGSAP } from "@gsap/react";
import React from "react";
import { HoverTextFX1 } from "~/components/animations/hover-text-fx";

const Page = () => {
  const scope = React.useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (scope.current) {
        const h1 = scope.current.querySelector("h1");
        const hoverText = new HoverTextFX1(h1);

        h1?.addEventListener("mouseenter", () => {
          hoverText.timeline.play();
        });
        h1?.addEventListener("mouseleave", () => {
          hoverText.timeline.reverse();
        });

        return () => {
          hoverText.revert();
        };
      }
    },
    { scope },
  );

  return (
    <main
      ref={scope}
      className="flex items-center justify-center text-6xl font-black h-dvh">
      <h1>Epen Flow©{new Date().getFullYear()}</h1>
    </main>
  );
};
export default Page;
