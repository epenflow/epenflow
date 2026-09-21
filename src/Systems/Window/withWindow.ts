import { createElement, type ComponentType, type FC } from "react";

function withWindow<T extends object>(Component: ComponentType<T>) {
  const Window: FC<T> = (props) => {
    return createElement(Component, props);
  };

  return Window;
}
