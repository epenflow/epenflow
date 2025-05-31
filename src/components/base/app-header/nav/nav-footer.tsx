import { useGSAP } from "@gsap/react";
import gsap from "gsap/all";
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

const NavDateNTime = () => {
  const date = useDateAndTime();

  return (
    <div className="pl-[calc(var(--header-padding)_*_2)] text-xs items-center justify-center w-full">
      <span suppressHydrationWarning>{date.toISOString()}</span>
    </div>
  );
};

const NavFooter: React.FC = withMemo((): React.ReactNode => {
  return (
    <div className="navigation--footer inline-flex justify-between px-0">
      <NavDateNTime />
      <NavTheme />
    </div>
  );
});
NavFooter.displayName = "NavFooter";
export default NavFooter;
