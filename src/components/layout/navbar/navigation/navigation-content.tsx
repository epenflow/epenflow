import { useVirtualizer } from "@tanstack/react-virtual";
import { motion } from "motion/react";
import React from "react";
import For from "~/components/layout/for";
import { withMemo } from "~/lib/utils";
import * as RouteTypeGen from "~/routeTree.gen";
import NavigationItem from "./navigation-item";

type NavigationContentProps = {
  onPress: () => void;
};
/**
 * Issue - Object references change with every scroll event
 */
const NavigationContent: React.FC<NavigationContentProps> = withMemo(
  ({ onPress }): React.ReactNode => {
    const { contents } = resources;
    const scope = React.useRef<HTMLDivElement>(null);

    const { getTotalSize, getVirtualItems } = useVirtualizer({
      count: contents.length,
      getScrollElement: () => scope.current,
      estimateSize: () => 35,
    });

    const cssProperties = React.useMemo(
      () =>
        ({
          "--virtual-content-height": `${getTotalSize()}px`,
        }) as React.CSSProperties,
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [],
    );

    return (
      <div ref={scope} style={cssProperties} className="navigation--content">
        <div className="virtual--container">
          <For each={getVirtualItems()}>
            {(virtual) => (
              <NavigationItem
                onClick={onPress}
                key={virtual.key}
                virtual={virtual}
                to={contents[virtual.index].to}>
                <motion.p
                  className="w-full will-change-transform"
                  initial={{
                    opacity: 0,
                    x: virtual.index % 2 === 0 ? 100 : -100,
                  }}
                  animate={{ opacity: 1, y: 0, x: 0 }}
                  transition={{ duration: 0.5, ease: "easeInOut" }}>
                  <span className="line-clamp-1 will-change-contents">
                    {contents[virtual.index].label}
                  </span>
                </motion.p>
              </NavigationItem>
            )}
          </For>
        </div>
      </div>
    );
  },
);
NavigationContent.displayName = "NavigationContent";

export default NavigationContent;
function getRandomContent() {
  return Array.from({ length: 10000 }).map(() => {
    const data: {
      label: string;
      to: RouteTypeGen.FileRouteTypes["to"];
    } = {
      label:
        "Lorem ip sum dolor sit amet cons ectetu radipis icing elit Esse labore accusamus voluptate praesentium sapiente mollitia aut commodi placeat obcaecati facilis, ipsum voluptates quaerat, laborum, aspernatur optio dolor non itaque et.",
      to: "/",
    };
    return data;
  });
}
const resources = {
  contents: [
    {
      label: "test",
      to: "/test",
    },
    ...getRandomContent(),
  ] satisfies Array<{
    label: string;
    to: RouteTypeGen.FileRouteTypes["to"];
  }>,
};
