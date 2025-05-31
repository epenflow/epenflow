import { useGSAP } from "@gsap/react";
import gsap, { SplitText } from "gsap/all";
import React from "react";
import useDateAndTime from "~/hooks/use-date-and-time";

const Time = () => {
  const scope = React.useRef<HTMLDivElement>(null);
  const date = useDateAndTime();
  const charsRef = React.useRef<SplitText | null>(null);
  const prevTimeRef = React.useRef<string>("");

  const fTime = React.useCallback(
    (d: Date) =>
      new Intl.DateTimeFormat("id-ID", {
        hourCycle: "h12",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      })
        .format(d)
        .replace(/\./g, ":"),
    [],
  );

  const currentTime = React.useMemo(() => fTime(date), [date, fTime]);
  React.useEffect(() => {
    if (!scope.current) return;

    scope.current.textContent = currentTime;
    prevTimeRef.current = currentTime;
    charsRef.current = new SplitText(scope.current, {
      type: "chars",
      charsClass: "time__char perspective-normal",
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useGSAP(
    () => {
      if (!prevTimeRef || !charsRef.current || !scope.current) return;

      const tl = gsap.timeline();
      const currentChars = charsRef.current.chars;
      const prevTime = prevTimeRef.current;

      if (prevTime === currentTime) return;

      const a_prevTime = prevTime.split("");
      const a_currentTime = currentTime.split("");

      a_currentTime.forEach((n, i) => {
        console.log("a_currentTime");
        if (currentChars[i] && n !== a_prevTime[i]) {
          const char = currentChars[i];

          tl.to(char, {
            yPercent: -100,
            autoAlpha: 0,
            ease: "power1.in",
          })
            .set(char, {
              text: n,
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

  return <div ref={scope} className="text-primary overflow-hidden text-9xl" />;
};
export default Time;
