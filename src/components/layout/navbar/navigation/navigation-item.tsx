/* eslint-disable react-refresh/only-export-components */
import { Link, type LinkComponentProps } from "@tanstack/react-router";
import { VirtualItem } from "@tanstack/react-virtual";
import { motion } from "motion/react";
import React from "react";
import { cn, withMemo } from "~/lib/utils";

type NavigationItemProps = {
  virtual: VirtualItem;
  children?: ((props: VirtualItem) => React.ReactNode) | React.ReactNode;
} & Omit<LinkComponentProps, "children">;

const NavigationItem: React.FC<NavigationItemProps> = withMemo(
  ({ virtual, style, children, className, ...props }): React.ReactNode => {
    const cssProperties = {
      "--virtual-height": `${virtual.size}px`,
      "--virtual-y-axis": `${virtual.start}px`,
    } as React.CSSProperties;

    const jsxToDisplay =
      typeof children === "function" ? children(virtual) : children;

    return (
      <Link
        {...props}
        style={{ ...cssProperties, ...style }}
        className={cn("virtual--item", className)}>
        {jsxToDisplay}
      </Link>
    );
  },
);
NavigationItem.displayName = "NavigationItem";
export default motion.create(NavigationItem);
