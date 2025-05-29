import { useGSAP } from "@gsap/react";
import gsap from "gsap/all";
import React from "react";
import { BlockSection, Paragraph } from "~/components/ui/typography";
import Info from "~/pages/home/animations/info";
import Social from "~/pages/home/animations/social";

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
        <Paragraph
          aria-label={`Epen Flow©${new Date().getFullYear()}`}
          className="font-medium text-center">
          Epen Flow©{new Date().getFullYear()}
        </Paragraph>
      </BlockSection>
    </main>
  );
};

export default Home;
