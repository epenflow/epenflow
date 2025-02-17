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
