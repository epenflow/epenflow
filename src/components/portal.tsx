import { useCallback, useSyncExternalStore, type ReactNode } from "react";

import { createPortal } from "react-dom";

type PortalTarget = Element | DocumentFragment;

interface PortalProps {
  mount?: PortalTarget | string;
  fallback?: PortalTarget | null;
  strict?: boolean;
  children?: ReactNode;
}

function resolve(mount?: PortalTarget | string): PortalTarget | null {
  if (mount == null) return null;

  if (typeof mount !== "string") return mount;

  return document.querySelector(mount);
}

export function Portal({ mount, fallback, strict = false, children }: PortalProps) {
  const subscribe = useCallback(
    (onChange: VoidFunction) => {
      if (typeof mount !== "string") return () => {};

      const observer = new MutationObserver(onChange);
      observer.observe(document.body, { childList: true, subtree: true });

      return () => observer.disconnect();
    },
    [mount],
  );

  const getSnapshot = useCallback(() => resolve(mount), [mount]);

  const snapshot = useSyncExternalStore(subscribe, getSnapshot, () => null);

  const resolved = snapshot ?? (strict ? null : (fallback ?? document.body));

  if (!resolved) return null;

  return createPortal(children, resolved);
}
