import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import React from "react";
import Info from "~/components/animations/info";
import Social from "~/components/animations/social";
import AppLayout from "~/layouts/app-layout";

gsap.registerPlugin(useGSAP);

const Home = () => {
  const tl = React.useRef<GSAPTimeline>(null);
  const infoTl = React.useRef<GSAPTimeline>(null);
  const socialTl = React.useRef<GSAPTimeline>(null);

  useGSAP(() => {
    tl.current = gsap.timeline({
      defaults: {
        delay: 0.001,
        ease: "sine.inOut",
      },
    });

    if (infoTl.current && socialTl.current && tl.current) {
      tl.current.add(infoTl.current);
      tl.current.add(socialTl.current);
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
