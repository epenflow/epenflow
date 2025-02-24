import gsap from "gsap";
import React from "react";
import { Button } from "react-aria-components";
import { cn } from "~/lib/utils";
import "./base.css";

/**
 * Issue: Lazy load animation glitching
 */
import { useIsomorphicLayoutEffect } from "motion/react";
import NavigationContent from "./navigation/navigation-content";
import NavigationFooter from "./navigation/navigation-footer";

const Navbar: React.FC = () => {
  return (
    <NavbarWrapper>
      {({ onPress }) => (
        <>
          <section className="header--inner">
            <Button
              onPress={onPress}
              className={cn("header--button", "data-[hovered]:from-purple-600")}
              aria-label="Toggle Navigation"
            />
          </section>

          <nav className="header--content">
            <span className="separator" />
            <NavigationContent onPress={onPress} />
            <span className="separator" />
            <NavigationFooter />
          </nav>
        </>
      )}
    </NavbarWrapper>
  );
};
Navbar.displayName = "Navbar";
export default Navbar;

type NavbarWrapperProps<
  TProps = {
    onPress: () => void;
  },
> = Omit<React.ComponentProps<"header">, "children"> & {
  children?: ((props: TProps) => React.ReactNode) | React.ReactNode;
};

const NavbarWrapper: React.FC<NavbarWrapperProps> = ({
  children,
  className,
  ...props
}): React.ReactNode => {
  const [isPress, setPress] = React.useState<boolean>(false);
  const scope = React.useRef<HTMLElement>(null);
  const timeline = React.useRef<GSAPTimeline>(null);

  useIsomorphicLayoutEffect(() => {
    timeline.current = new NavbarAnimationTimeline(
      scope.current!,
      gsap.timeline({
        defaults: {
          ease: "sine.inOut",
        },
      }),
    ).timeline;
  }, []);

  useIsomorphicLayoutEffect(() => {
    if (isPress) {
      timeline.current?.play();
    } else {
      timeline.current?.reverse();
    }
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
NavbarWrapper.displayName = "NavbarWrapper";
class NavbarAnimationTimeline {
  constructor(
    private scope: HTMLElement,
    private tl: GSAPTimeline,
  ) {
    this.#init();
  }

  #init() {
    const start = 0;
    const end = 0.5;

    this.tl.to(
      ".header--inner",
      {
        "--header-width": "20rem",
      },
      start,
    );

    this.tl.to(
      ".header--button",
      {
        left: "calc(20rem - 1rem)",
        ease: "linear",
      },
      end,
    );

    this.tl.to(
      this.scope,
      {
        height: `calc(50svh - calc(var(--header-top) * 2))`,
        duration: 1,
      },
      end,
    );

    this.tl.fromTo(
      ".header--content",
      {
        autoAlpha: 0,
      },
      {
        autoAlpha: 1,
      },
      end,
    );
  }
  get timeline() {
    return this.tl;
  }
}
