import { useGSAP } from "@gsap/react";
import React, { useRef } from "react";
import NavbarFX from "./navbar-fx";
import NavbarList from "./navbar-list";
import "./navbar-style.css";
import NavbarTheme from "./navbar-theme";
import NavbarTime from "./navbar-time";

const Navbar = () => {
  const scope = useRef<HTMLElement>(null);
  const navbarFX = useRef<NavbarFX>(null);

  const { contextSafe } = useGSAP(
    () => {
      if (!scope.current) return;

      navbarFX.current = new NavbarFX(scope.current);

      return () => {
        navbarFX.current?.revert();
        navbarFX.current = null;
      };
    },
    { scope, dependencies: [] },
  );

  const onToggle = contextSafe((event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    navbarFX.current?.toggle();
  });

  return (
    <header ref={scope} className="header antialiased">
      <section onClick={onToggle} className="header__toggle-wrap">
        <button onClick={onToggle} className="header__toggle">
          <div className="header__toggle-outer animate-pulse" />
          <div className="header__toggle-inner" />
          <span className="sr-only">Toggle Navbar</span>
        </button>
        <h1 className="header__heading header__h1">EF__EpenFlow</h1>
      </section>
      <section className="header__content-wrap">
        <div className="header__content-first">
          <NavbarList onToggle={onToggle} />
        </div>
        <div className="header__content-separator" />
        <div className="header__content-last">
          <NavbarTime />
          <NavbarTheme />
        </div>
      </section>
    </header>
  );
};
export default Navbar;
