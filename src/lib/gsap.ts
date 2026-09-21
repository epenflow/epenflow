import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { hasWindow } from "#/lib/utils.ts";

if (hasWindow()) {
  gsap.registerPlugin(useGSAP);
}

export { gsap, useGSAP };
