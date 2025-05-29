import { useGSAP } from "@gsap/react";
import gsap from "gsap/all";
import React from "react";
import {
  BlockSection,
  Heading,
  Paragraph,
} from "../../../components/ui/typography";
import For from "../../../components/utility/for";

type DemoProps = {
  tl: GSAPTimeline | null;
};
const Demo: React.FC<DemoProps> = ({ tl: globalTl }) => {
  const { demos } = resources;
  const scope = React.useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (globalTl) {
        const tl = gsap.timeline({
          id: "demoTL",
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

        tl.from("[data-demo]", {
          xPercent: "random(-100,100)",
          yPercent: "random(-100,100)",
          stagger: 0.25,
          autoAlpha: 0,
        });

        globalTl.add(["demo", tl], "demo-=0.5");
      }
    },
    { scope, dependencies: [globalTl] },
  );

  return (
    <BlockSection ref={scope} aria-label="Demo">
      <Heading data-href className="font-medium">
        Demo
      </Heading>
      <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
        <For each={demos}>
          {(demo, key) => (
            <Paragraph
              data-demo
              key={key}
              aria-label={demo.label}
              className="line-clamp-1">
              <a href={demo.to}>{demo.label}</a>
            </Paragraph>
          )}
        </For>
      </div>
    </BlockSection>
  );
};
export default Demo;

const resources = {
  demos: [
    {
      label: "Demo E-Menu",
      to: "https://e-menu-psi.vercel.app/",
    },
    {
      label: "Demo EF",
      to: "https://demo-bay-gamma.vercel.app/",
    },
    {
      label: "Demo Liveheats",
      to: "https://liveheats-psi.vercel.app/",
    },
    {
      label: "Demo Heats V1",
      to: "https://heat-website-ten.vercel.app/",
    },
    {
      label: "Demo Heats V2",
      to: "https://heat-lyart.vercel.app/",
    },
    {
      label: "Demo DrinkIwak",
      to: "https://drink-iwak.vercel.app/",
    },
    {
      label: "Demo Auth",
      to: "https://auth-wheat.vercel.app/",
    },
    {
      label: "Demo EF-Studio",
      to: "https://ef-studio.vercel.app/",
    },
    {
      label: "Demo Invitation V1",
      to: "https://balarama-fitri.vercel.app/",
    },
    {
      label: "Demo Invitation V2",
      to: "https://golden-hour-nine.vercel.app/",
    },
    {
      label: "Demo Invitation V3",
      to: "https://classic-marble.vercel.app/",
    },
    {
      label: "Demo Softcomp",
      to: "https://rd-nx-softcomp.vercel.app/",
    },
    {
      label: "Demo Pondok Kopi Penglipuran",
      to: "https://pondokkopipenglipuran.vercel.app/",
    },
    {
      label: "Demo Tokoevent",
      to: "https://tokoevent.vercel.app/",
    },
    {
      label: "Demo Bangli Skatepark",
      to: "https://bangliskatepark.vercel.app/",
    },
  ],
};
