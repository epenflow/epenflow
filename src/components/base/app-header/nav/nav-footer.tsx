import { useGSAP } from "@gsap/react";
import gsap, { SplitText } from "gsap/all";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import React from "react";
import { Button } from "~/components/ui/button";
import useDateAndTime from "~/hooks/use-date-and-time";
import { withMemo } from "~/lib/utils";

const NavTheme = () => {
  const scope = React.useRef<HTMLDivElement>(null);
  const { setTheme, resolvedTheme } = useTheme();

  useGSAP(
    () => {
      const tl = gsap.timeline({
        defaults: { duration: 0.75, ease: "power2.out" },
      });

      if (resolvedTheme === "dark") {
        tl.to("[data-icon-dark]", { opacity: 1, x: "0%", y: "0%" }, 0)
          .to("[data-icon-light]", { opacity: 0, x: "100%", y: "100%" }, 0)
          .to("[data-span-dark]", { opacity: 1, y: "0%" }, 0)
          .to("[data-span-light]", { opacity: 0, y: "-100%" }, 0);
      } else {
        tl.to("[data-icon-dark]", { opacity: 0, x: "100%", y: "100%" }, 0)
          .to("[data-icon-light]", { opacity: 1, x: "0%", y: "0%" }, 0)
          .to("[data-span-dark]", { opacity: 0, y: "100%" }, 0)
          .to("[data-span-light]", { opacity: 1, y: "0%" }, 0);
      }
    },
    { scope, dependencies: [resolvedTheme] },
  );

  const onPress = React.useCallback(() => {
    if (resolvedTheme === "dark") {
      setTheme("light");
    } else {
      setTheme("dark");
    }
  }, [setTheme, resolvedTheme]);

  return (
    <div
      ref={scope}
      className="space-x-[calc(var(--header-padding)_*_2)] inline-flex items-center">
      <div className="grid [&_span]:[grid-area:1/1] h-fit overflow-hidden">
        <span data-span-light>Light</span>
        <span data-span-dark>Dark</span>
      </div>

      <Button
        onClick={onPress}
        variant="ghost"
        size="icon"
        className="overflow-hidden">
        <div className="grid [&_svg]:[grid-area:1/1]">
          <Moon data-icon-dark />
          <Sun data-icon-light />
          <span className="sr-only">Toggle theme</span>
        </div>
      </Button>
    </div>
  );
};

const NavTime = () => {
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
        .replace(/\./g, "__"),
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

  return (
    <div className="pl-[calc(var(--header-padding)_*_2)] text-xs items-center justify-center w-full">
      <div ref={scope} className="overflow-clip" />
    </div>
  );
};

const NavFooter: React.FC = withMemo((): React.ReactNode => {
  return (
    <div className="navigation--footer inline-flex justify-between px-0">
      <NavTime />
      <NavTheme />
    </div>
  );
});
NavFooter.displayName = "NavFooter";
export default NavFooter;
