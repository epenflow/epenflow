import { type ClassValue, clsx } from "clsx";
import React from "react";
import { twMerge } from "tailwind-merge";

export function cn(...args: ClassValue[]) {
  return twMerge(clsx(args));
}

export const withOptional: (component: React.FC, mode?: boolean) => React.FC = (
  component,
  mode = false,
) => (mode ? component : () => null);

export const withMemo: <T>(
  Component: T,
  propsAreEqual?: (prevProps: Readonly<T>, nextProps: Readonly<T>) => boolean,
) => T = React.memo;

export const disableReactDevTools = () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const DEVTOOLS = (window as any).__REACT_DEVTOOLS_GLOBAL_HOOK__;
  if (typeof DEVTOOLS === "object") {
    for (const [key, value] of Object.entries(DEVTOOLS)) {
      DEVTOOLS[key] = typeof value === "function" ? Function.prototype : null;
    }
  }
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const withLazy = <T extends React.ComponentType<any>>(
  loader: Promise<{ default: T }>,
) => {
  return React.lazy(() => loader);
};
