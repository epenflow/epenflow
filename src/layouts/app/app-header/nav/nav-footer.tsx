import { Moon as MoonIcon, Sun as SunIcon } from "lucide-react";
import { motion } from "motion/react";
import { useTheme } from "next-themes";
import React from "react";
import Button from "~/components/ui/button";
import useDateAndTime from "~/hooks/use-date-and-time";
import { withMemo } from "~/lib/utils";

const Moon = motion.create(MoonIcon);
const Sun = motion.create(SunIcon);

const NavFooter: React.FC = withMemo((): React.ReactNode => {
  const date = useDateAndTime();
  const { setTheme, resolvedTheme } = useTheme();

  const onPress = React.useCallback(() => {
    if (resolvedTheme === "dark") {
      setTheme("light");
    } else {
      setTheme("dark");
    }
  }, [setTheme, resolvedTheme]);

  const buttonToDisplay = React.useMemo(() => {
    return (
      <Button
        onPress={onPress}
        variant="ghost"
        size="icon"
        className="data-[hovered]:bg-transparent overflow-hidden">
        {({ isPressed }) => (
          <div className="grid [&_svg]:[grid-area:1/1]">
            <Moon
              animate={{
                opacity: resolvedTheme === "dark" ? 1 : 0,
                y: isPressed ? 100 : 0,
                x: isPressed ? 100 : 0,
              }}
              transition={{ duration: 0.75 }}
              className="size-4"
            />
            <Sun
              animate={{
                opacity: resolvedTheme === "light" ? 1 : 0,
                y: isPressed ? -100 : 0,
                x: isPressed ? -100 : 0,
              }}
              transition={{ duration: 0.75 }}
              className="size-4"
            />
            <span className="sr-only">Toggle theme</span>
          </div>
        )}
      </Button>
    );
  }, [resolvedTheme, onPress]);

  const themeToDisplay = React.useMemo(
    () => (
      <span className="grid [&_span]:[grid-area:1/1] h-fit overflow-hidden">
        <motion.span
          animate={{
            opacity: resolvedTheme === "dark" ? 0 : 1,
            y: resolvedTheme === "dark" ? "-100%" : "0%",
          }}
          transition={{ duration: 0.5 }}>
          Light
        </motion.span>
        <motion.span
          animate={{
            opacity: resolvedTheme === "dark" ? 1 : 0,
            y: resolvedTheme === "dark" ? "0%" : "100%",
          }}
          transition={{ duration: 0.5 }}>
          Dark
        </motion.span>
      </span>
    ),
    [resolvedTheme],
  );

  const dateToDisplay = React.useMemo(
    () => <span suppressHydrationWarning>{date.toISOString()}</span>,
    [date],
  );

  return (
    <div className="navigation--footer inline-flex justify-between px-0">
      <div className="p-(--header-content-padding) text-xs inline-flex items-center justify-between w-full">
        {dateToDisplay}
        {themeToDisplay}
      </div>
      {buttonToDisplay}
    </div>
  );
});
NavFooter.displayName = "NavFooter";
export default NavFooter;
