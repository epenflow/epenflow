import { useGSAP } from "@gsap/react";
import gsap, { GSDevTools } from "gsap/all";
import React from "react";
import Info from "~/components/animations/info";
import Social from "~/components/animations/social";
import AppLayout from "~/layouts/app-layout";

gsap.registerPlugin(useGSAP, GSDevTools);

const Home = () => {
  const globalTl = React.useRef<GSAPTimeline>(null);
  const infoTl = React.useRef<GSAPTimeline>(null);
  const socialTl = React.useRef<GSAPTimeline>(null);

  useGSAP(() => {
    globalTl.current = gsap.timeline({
      defaults: {
        delay: 0.001,
        ease: "sine.inOut",
      },
      id: "homeTl",
    });

    if (infoTl.current && socialTl.current && globalTl.current) {
      globalTl.current.add(infoTl.current);
      globalTl.current.add(socialTl.current);
      GSDevTools.create({ animation: globalTl.current });
    }
  });

  return (
    <AppLayout>
      <div className="w-full min-h-dvh h-full overflow-hidden">
        <Info tl={infoTl} />
        <Social tl={socialTl} />
      </div>
    </AppLayout>
  );
};
export default Home;
