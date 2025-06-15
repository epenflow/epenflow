import { useGSAP } from "@gsap/react";
import gsap, { SplitText } from "gsap/all";
import React, { useCallback, useEffect, useMemo, useRef } from "react";
import useDateAndTime from "~/hooks/use-date-and-time";

const NavbarTime = () => {
  const date = useDateAndTime();
  const scope = React.useRef<HTMLDivElement>(null);
  const charsRef = useRef<SplitText>(null);
  const prevTimeRef = useRef<string>(null);

  const formatTime = useCallback(
    (date: Date) =>
      new Intl.DateTimeFormat("id-ID", {
        hourCycle: "h12",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      })
        .format(date)
        .replace(/\./g, "__"),
    [],
  );

  const currentTime = useMemo(() => formatTime(date), [date, formatTime]);

  useEffect(() => {
    if (!scope.current) return;

    scope.current.innerHTML = currentTime;
    prevTimeRef.current = currentTime;
    charsRef.current = SplitText.create(scope.current, {
      type: "chars",
      charsClass: "header__time-char",
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useGSAP(
    () => {
      if (!prevTimeRef.current || !charsRef.current || !scope.current) return;

      const tl = gsap.timeline({
        id: "navbar__time",
        defaults: {
          ease: "none",
        },
      });
      const currentChars: Element[] = charsRef.current.chars;
      const prevTime: string = prevTimeRef.current;

      if (prevTime === currentTime) return;

      const prevTimes = prevTime.split("");
      const currentTimes = currentTime.split("");

      currentTimes.forEach((time, index) => {
        if (currentChars[index] && time !== prevTimes[index]) {
          const char = currentChars[index];

          tl.to(char, {
            yPercent: -100,
            autoAlpha: 0,
            ease: "power1.in",
          })
            .set(char, {
              text: time,
              yPercent: 100,
              autoAlpha: 0,
            })
            .to(char, {
              yPercent: 0,
              autoAlpha: 1,
              ease: "power1.out",
            });
        }
      });
      prevTimeRef.current = currentTime;
    },
    { scope, dependencies: [currentTime] },
  );

  return <div ref={scope} className="header__time-wrap header__h1" />;
};

export default NavbarTime;
