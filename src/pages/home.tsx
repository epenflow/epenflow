import { useGSAP } from "@gsap/react";
import gsap, { GSDevTools, ScrambleTextPlugin, SplitText } from "gsap/all";
import React from "react";
import Demo from "~/components/animations/demo";
import Info from "~/components/animations/info";
import Social from "~/components/animations/social";
import { BlockSection, Paragraph } from "~/components/ui/typography";
import AppLayout from "~/layouts/app-layout";

gsap.registerPlugin(useGSAP, GSDevTools, ScrambleTextPlugin, SplitText);

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

  // React.useEffect(() => {
  //   if (globalTl) {
  //     GSDevTools.create({ animation: globalTl });
  //     console.log(globalTl.labels);
  //   }
  // }, [globalTl]);

  return (
    <AppLayout>
      <div className="w-full min-h-dvh h-full overflow-hidden">
        <Info tl={globalTl} />
        <Demo tl={globalTl} />
        <Social tl={globalTl} />

        <BlockSection className="mb-5" aria-label="Footer">
          <Paragraph
            aria-label={`Epen Flow©${new Date().getFullYear()}`}
            className="font-medium text-center">
            Epen Flow©{new Date().getFullYear()}
          </Paragraph>
        </BlockSection>
      </div>
    </AppLayout>
  );
};

export default Home;
