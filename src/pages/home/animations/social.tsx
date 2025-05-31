import { useGSAP } from "@gsap/react";
import gsap from "gsap/all";
import React from "react";
import HoverText from "~/components/animations/hover-text";
import {
  BlockSection,
  Heading,
  paragraphVariants,
} from "~/components/ui/typography";
import For from "~/components/utility/for";
import { cn } from "~/lib/utils";

type SocialProps = {
  tl: GSAPTimeline | null;
};
const Social: React.FC<SocialProps> = ({ tl: globalTl }) => {
  const { socials } = resources;
  const scope = React.useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (globalTl) {
        const tl = gsap.timeline({
          id: "socialTL",
        });

        tl.from("[data-href]", {
          xPercent: -100,
          yPercent: 100,
          duration: 1,
          autoAlpha: 0,
          ease: "sine.inOut",
        });

        tl.from("[data-social]", {
          y: 50,
          x: (i) => (i % 2 === 0 ? 50 : -50),
          stagger: 0.25,
          autoAlpha: 0,
          ease: "sine.inOut",
        });

        globalTl.add(["social", tl], "social-=0.5");
      }
    },
    { scope, dependencies: [globalTl] },
  );

  return (
    <BlockSection ref={scope} aria-label="Social">
      <Heading className="font-medium" data-href>
        More
      </Heading>
      <For each={socials}>
        {(social, key) => (
          <div
            className={cn(paragraphVariants())}
            key={key}
            data-social={social.href}
            aria-label={social.label}>
            <a href={social.href} aria-label={social.label}>
              <HoverText aria-label={social.label}>{social.label}</HoverText>
            </a>
          </div>
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
