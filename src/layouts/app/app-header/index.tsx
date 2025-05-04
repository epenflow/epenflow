import React from "react";
import "./base.css";

/**
 * Issue: Lazy load animation glitching
 */
import AppHeaderOuter from "./app-header-outer";
import NavContent from "./nav/nav-content";
import NavFooter from "./nav/nav-footer";

const AppHeader: React.FC = () => {
  return (
    <AppHeaderOuter>
      {({ onPress }) => (
        <>
          <section className="header--inner">
            <button
              onClick={onPress}
              className="header--button"
              aria-label="Toggle Navigation"
            />
          </section>

          <nav className="header--content">
            <span className="separator" />
            <NavContent onPress={onPress} />
            <span className="separator" />
            <NavFooter />
          </nav>
        </>
      )}
    </AppHeaderOuter>
  );
};
AppHeader.displayName = "AppHeader";
export default AppHeader;
