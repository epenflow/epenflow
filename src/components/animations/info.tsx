import { useGSAP } from "@gsap/react";
import gsap, { SplitText } from "gsap/all";
import React from "react";
import { BlockSection, Heading, Paragraph } from "../ui/typography";

gsap.registerPlugin(useGSAP, SplitText);

type Info = {
  tl: React.RefObject<gsap.core.Timeline | null>;
};
const Info: React.FC<Info> = ({ tl: globalTl }) => {
  const scope = React.useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const tl = gsap.timeline();

      tl.from("[data-href]", {
        xPercent: -100,
        yPercent: 100,
        duration: 1,
        autoAlpha: 0,
        ease: "sine.inOut",
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
          ease: "sine.inOut",
          filter: "blur(10px) brightness(50%)",
          willChange: "filter, transform",
        },
        "+=0.025",
      );

      globalTl.current?.add(tl);
    },
    { scope },
  );

  return (
    <BlockSection ref={scope}>
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
