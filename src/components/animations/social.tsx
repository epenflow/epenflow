import { useGSAP } from "@gsap/react";
import gsap from "gsap/all";
import React from "react";
import { BlockSection, Heading, Paragraph } from "../ui/typography";
import For from "../utility/for";

gsap.registerPlugin(useGSAP);

type SocialProps = {
  tl: React.RefObject<gsap.core.Timeline | null>;
};
const Social: React.FC<SocialProps> = ({ tl: globalTl }) => {
  const { socials } = resources;
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

      tl.from("[data-pref]", {
        y: 50,
        x: (i) => (i % 2 === 0 ? 50 : -50),
        stagger: 0.25,
        autoAlpha: 0,
        ease: "sine.inOut",
      });

      globalTl.current?.add(tl);
    },
    { scope },
  );

  return (
    <BlockSection ref={scope}>
      <Heading className="font-medium" data-href>
        More
      </Heading>
      <For each={socials}>
        {(social, key) => (
          <Paragraph key={key} data-pref>
            <a href={social.href}>{social.label}</a>
          </Paragraph>
        )}
      </For>
    </BlockSection>
  );
};
export default Social;

const resources = {
  socials: [
    {
      href: import.meta.env.VITE_INSTAGRAM || "#",
      label: "Instagram",
    },
    {
      href: import.meta.env.VITE_FACEBOOK || "#",
      label: "Facebook",
    },
    {
      href: import.meta.env.VITE_TWITTER || "#",
      label: "Twitter",
    },
    {
      href: import.meta.env.VITE_THREADS || "#",
      label: "Threads",
    },
    {
      href: import.meta.env.VITE_LINKEDIN || "#",
      label: "Linkedin",
    },
  ] satisfies Array<{ label: string; href: string }>,
};
