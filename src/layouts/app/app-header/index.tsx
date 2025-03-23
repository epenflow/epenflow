import React from "react";
import { Button } from "react-aria-components";
import { cn } from "~/lib/utils";
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
            <Button
              onPress={onPress}
              className={cn("header--button", "data-[hovered]:from-purple-600")}
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
