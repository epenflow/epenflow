import { useGSAP } from "@gsap/react";
import gsap from "gsap/all";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import React, { useCallback, useRef } from "react";

const NavbarTheme = () => {
  const { resolvedTheme, setTheme } = useTheme();
  const scope = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!scope.current) return;

      const selector = (target: string) =>
        scope.current?.querySelector(target) || null;
      const timeline = gsap.timeline({
        defaults: {
          ease: "power4",
          duration: 0.75,
        },
      });

      const lightLabel = selector(".header__theme-label.light");
      const darkLabel = selector(".header__theme-label.dark");
      const lightIcon = selector(".header__toggle-theme-icon.light");
      const darkIcon = selector(".header__toggle-theme-icon.dark");

      if (resolvedTheme === "dark") {
        timeline
          .to(darkLabel, { yPercent: 0, scaleY: 1 }, 0)
          .to(lightLabel, { yPercent: -100, scaleY: 0.25 }, "<");

        timeline
          .to(darkIcon, { xPercent: 0, yPercent: 0, rotate: 0 }, 0)
          .to(lightIcon, { xPercent: 100, yPercent: 100, rotate: 0 }, "<");
      } else {
        timeline
          .to(darkLabel, { yPercent: 100, scaleY: -0.25 }, 0)
          .to(lightLabel, { yPercent: 0, scaleY: 1 }, "<");

        timeline
          .to(darkIcon, { xPercent: 100, yPercent: 100, rotate: 360 }, 0)
          .to(lightIcon, { xPercent: 0, yPercent: 0, rotate: 0 }, "<");
      }
    },
    { scope, dependencies: [resolvedTheme] },
  );

  const onToggle = useCallback(
    (event: React.MouseEvent) => {
      event.stopPropagation();
      setTheme(resolvedTheme === "dark" ? "light" : "dark");
    },
    [resolvedTheme, setTheme],
  );

  return (
    <div ref={scope} onClick={onToggle} className="header__theme-wrap">
      <div aria-label="theme" className="header__theme-label-wrap">
        <h1
          data-theme={resolvedTheme}
          className="header__theme-label header__h1 light">
          Light
        </h1>
        <h1
          data-theme={resolvedTheme}
          className="header__theme-label header__h1 dark">
          Dark
        </h1>
        <span className="sr-only">{resolvedTheme}</span>
      </div>
      <button aria-label="toggle theme" className="header__toggle-theme">
        <div className="header__toggle-theme-inner">
          <Sun
            data-theme={resolvedTheme}
            className="header__toggle-theme-icon light"
          />
          <Moon
            data-theme={resolvedTheme}
            className="header__toggle-theme-icon dark"
          />
        </div>
        <span className="sr-only">Toggle Theme</span>
      </button>
    </div>
  );
};

export default NavbarTheme;
