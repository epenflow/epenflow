import { useGSAP } from "@gsap/react";
import gsap from "gsap/all";
import React from "react";
import HoverText from "~/components/animations/hover-text";
import { BlockSection } from "~/components/ui/typography";
import Social from "~/pages/home/animations/social";
import Info from "./animations/info";

const Home = () => {
  const [globalTl, setGlobalTL] = React.useState<gsap.core.Timeline | null>(
    null,
  );

  useGSAP(() => {
    setGlobalTL(
      gsap.timeline({
        defaults: {
          delay: 0.001,
          ease: "sine.inOut",
        },
        id: "homeTl",
      }),
    );
  }, [setGlobalTL]);

  return (
    <main className="w-full min-h-dvh h-full overflow-hidden">
      <Info tl={globalTl} />
      <Social tl={globalTl} />

      <BlockSection className="mb-5" aria-label="Footer">
        <HoverText
          className="mx-auto"
          aria-label={`Epen Flow©${new Date().getFullYear()}`}>
          Epen Flow©{new Date().getFullYear()}
        </HoverText>
      </BlockSection>
    </main>
  );
};

export default Home;
