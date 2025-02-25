import gsap from "gsap";
import { useIsomorphicLayoutEffect } from "motion/react";
import React from "react";
import { Button } from "react-aria-components";
import { cn } from "~/lib/utils";
import "./base.css";

/**
 * Issue: Lazy load animation glitching
 */
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
    timeline.current = new NavbarAnimation(scope.current!).timeline;
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
class NavbarAnimation {
  #tl: GSAPTimeline;
  #pos = { start: 0, end: 0.5 };

  constructor(private scope: HTMLElement | null) {
    this.#tl = gsap.timeline({
      defaults: {
        ease: "sine.inOut",
      },
    });
    this.#initializeTl();
  }

  #initializeTl() {
    this.#tl.to(
      ".header--inner",
      {
        "--header-width": "20rem",
      },
      this.#pos.start,
    );

    this.#tl.to(
      ".header--button",
      {
        left: "calc(20rem - 1rem)",
        ease: "linear",
      },
      this.#pos.end,
    );

    this.#tl.to(
      this.scope,
      {
        height: `calc(50svh - calc(var(--header-top) * 2))`,
        duration: 1,
      },
      this.#pos.end,
    );

    this.#tl.fromTo(
      ".header--content",
      {
        autoAlpha: 0,
      },
      {
        autoAlpha: 1,
      },
      this.#pos.end,
    );
  }
  get timeline() {
    return this.#tl;
  }
}
