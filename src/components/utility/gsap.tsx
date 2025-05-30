import { useGSAP } from "@gsap/react";
import gsap, {
  GSDevTools,
  ScrambleTextPlugin,
  ScrollTrigger,
  SplitText,
  TextPlugin,
} from "gsap/all";
import React from "react";

const GSAPRegister = () => {
  React.useLayoutEffect(() => {
    gsap.registerPlugin(
      useGSAP,
      GSDevTools,
      ScrambleTextPlugin,
      SplitText,
      TextPlugin,
      ScrollTrigger,
    );
  }, []);

  return null;
};
export default GSAPRegister;
