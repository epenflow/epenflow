import { GSDevTools } from "gsap/all";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(useGSAP, GSDevTools);
}

export { gsap, GSDevTools, useGSAP };
