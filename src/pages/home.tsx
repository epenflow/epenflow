import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import React from "react";
import Info from "~/components/animations/info";
import Social from "~/components/animations/social";
import AppLayout from "~/layouts/app-layout";

gsap.registerPlugin(useGSAP);

const Home = () => {
  const tl = React.useRef<GSAPTimeline>(null);

  useGSAP(() => {
    tl.current = gsap.timeline({
      defaults: {
        delay: 0.001,
        ease: "sine.inOut",
      },
    });
  });

  return (
    <AppLayout>
      <div className="w-full min-h-dvh h-full overflow-hidden">
        <Info tl={tl} />
        <Social tl={tl} />
      </div>
    </AppLayout>
  );
};
export default Home;
