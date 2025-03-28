import { useIsomorphicLayoutEffect } from "motion/react";
import React from "react";
import { cn } from "~/lib/utils";
import AppHeaderAnimation from "./app-header-animation";

type AppHeaderOuterProps<
  TProps = {
    onPress: () => void;
  },
> = Omit<React.ComponentProps<"header">, "children"> & {
  children?: ((props: TProps) => React.ReactNode) | React.ReactNode;
};

const AppHeaderOuter: React.FC<AppHeaderOuterProps> = ({
  children,
  className,
  ...props
}): React.ReactNode => {
  const [isPress, setPress] = React.useState<boolean>(false);
  const scope = React.useRef<HTMLElement>(null);
  const timeline = React.useRef<GSAPTimeline>(null);

  useIsomorphicLayoutEffect(() => {
    timeline.current = new AppHeaderAnimation(scope.current!).timeline;
  }, []);

  useIsomorphicLayoutEffect(() => {
    if (isPress) {
      timeline.current?.play();
    } else {
      timeline.current?.reverse();
    }

    return () => {
      timeline.current?.kill();
    };
  }, [isPress]);

  const onPress = React.useCallback(() => {
    setPress((prev) => !prev);
  }, []);

  const jsxToDisplay =
    typeof children === "function" ? children({ onPress }) : children;

  return (
    <header
      ref={scope}
      className={cn("header--outer font-medium text-xs", className)}
      {...props}>
      {jsxToDisplay}
    </header>
  );
};
export default AppHeaderOuter;
