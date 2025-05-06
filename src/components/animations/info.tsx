import { useGSAP } from "@gsap/react";
import gsap, { SplitText } from "gsap/all";
import React from "react";
import { BlockSection, Heading, Paragraph } from "../ui/typography";

type Info = {
  tl: GSAPTimeline | null;
};
const Info: React.FC<Info> = ({ tl: globalTl }) => {
  const scope = React.useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (globalTl) {
        const tl = gsap.timeline({
          id: "infoTL",
          defaults: {
            ease: "sine.inOut",
          },
        });

        tl.from("[data-href]", {
          xPercent: -100,
          yPercent: 100,
          duration: 1,
          autoAlpha: 0,
        });

        const pRef = SplitText.create("[data-pref]", { type: "words, chars" });
        tl.from(
          pRef.chars,
          {
            yPercent: 100,
            autoAlpha: 0,
            stagger: 0.025,
            scaleY: 0.1,
            scaleX: 1.8,
            filter: "blur(10px) brightness(50%)",
            willChange: "filter, transform",
          },
          "-=0.25",
        );

        globalTl.add(["info", tl], 0);
      }
    },
    { scope, dependencies: [globalTl] },
  );

  return (
    <BlockSection ref={scope} aria-label="Info">
      <Heading data-href className="font-medium">
        Info
      </Heading>
      <Paragraph data-pref>
        Hello, I'm Epen Flow, a Bali-based Web Developer passionate about
        crafting seamless and intuitive digital experiences.
      </Paragraph>
      <Paragraph data-pref>
        With expertise in various frameworks and backend technologies, I excel
        in building scalable, high-performance web applications. My specialty
        lies in creating immersive web experiences that merge stunning
        aesthetics, engaging interactions, and intuitive usability to deliver
        exceptional results.
      </Paragraph>
    </BlockSection>
  );
};
export default Info;
