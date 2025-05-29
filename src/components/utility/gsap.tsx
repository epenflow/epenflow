import { useGSAP } from "@gsap/react";
import gsap, {
  GSDevTools,
  ScrambleTextPlugin,
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
    );
  }, []);

  return null;
};
export default GSAPRegister;
