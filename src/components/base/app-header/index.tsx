import React from "react";
import "./base.css";

/**
 * Issue: Lazy load animation glitching
 */
import AppHeaderFX from "./app-header-fx";
import NavContent from "./nav/nav-content";
import NavFooter from "./nav/nav-footer";

type AppHeaderContext = {
  appHeaderFXRef: React.RefObject<AppHeaderFX | null>;
  toggleAppHeaderFX: VoidFunction;
};

// eslint-disable-next-line react-refresh/only-export-components
export const AppHeaderContextValue =
  React.createContext<AppHeaderContext | null>(null);

const AppHeader: React.FC = () => {
  const scope = React.useRef<HTMLElement>(null);
  const appHeaderFXRef = React.useRef<AppHeaderFX>(null);
  const [appHeaderFXState, setAppHeaderFXState] =
    React.useState<boolean>(false);

  const toggleAppHeaderFX = React.useCallback(() => {
    setAppHeaderFXState((state) => !state);
  }, []);

  React.useLayoutEffect(() => {
    if (!scope.current) return;
    appHeaderFXRef.current = new AppHeaderFX(scope.current);

    return () => {
      appHeaderFXRef.current = null;
    };
  }, []);

  React.useEffect(() => {
    if (!appHeaderFXRef.current) return;

    if (appHeaderFXState) {
      appHeaderFXRef.current.toggle();
    } else {
      appHeaderFXRef.current.toggle();
    }
  }, [appHeaderFXState]);

  return (
    <AppHeaderContextValue value={{ appHeaderFXRef, toggleAppHeaderFX }}>
      <header ref={scope} className="header--outer font-medium text-xs">
        <section className="header--inner">
          <button
            onClick={toggleAppHeaderFX}
            className="header--button"
            aria-label="Toggle Navigation"
          />
        </section>

        <nav className="header--content">
          <span className="separator" />
          <NavContent />
          <span className="separator" />
          <NavFooter />
        </nav>
      </header>
    </AppHeaderContextValue>
  );
};
AppHeader.displayName = "AppHeader";
export default AppHeader;
