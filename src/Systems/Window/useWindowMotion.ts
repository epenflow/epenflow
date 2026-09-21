import { useRef } from "react";

import { useProcess } from "#/Systems/Process/useProcess.ts";
import { ProcessStore } from "#/Systems/Process/ProcessStore.ts";
import { gsap, useGSAP } from "#/lib/gsap.ts";

const RADIUS = {
  rounded: 12,
  square: 0,
};
export function useWindowMotion(pid: string) {
  const motionRef = useRef<HTMLElement>(null);

  const maximized = useProcess(pid, (state) => state.window.maximized);
  const minimized = useProcess(pid, (state) => state.window.minimized);
  const closed = useProcess(pid, (state) => state.window.closed);

  useGSAP(() => {
    gsap.fromTo(
      motionRef.current,
      {
        opacity: 0,
        scale: 0.85,
        y: 10,
      },
      {
        y: 0,
        opacity: 1,
        scale: 1,
        duration: 0.35,
        ease: "back.out(1.1)",
        clearProps: true,
      },
    );
  }, []);

  useGSAP(() => {
    gsap.to(motionRef.current, {
      borderRadius: maximized && !minimized ? RADIUS.square : RADIUS.rounded,
      duration: 0.35,
      ease: "power3.out",
    });
  }, [maximized, minimized]);

  useGSAP(() => {
    if (!closed) return;

    gsap.to(motionRef.current, {
      opacity: 0,
      scale: 0.9,
      duration: 0.15,
      ease: "power3.in",
      onComplete: () => ProcessStore.actions.close(pid, true),
    });
  }, [closed, pid]);

  return motionRef;
}
