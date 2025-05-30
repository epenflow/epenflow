import { useVirtualizer } from "@tanstack/react-virtual";
import { motion } from "motion/react";
import React from "react";
import For from "~/components/utility/for";
import { withMemo } from "~/lib/utils";
import contents from "./contents";
import NavItem from "./nav-item";

type NavContentProps = {
  onPress: () => void;
};
/**
 * Issue - Object references change with every scroll event
 */
const NavContent: React.FC<NavContentProps> = withMemo(
  ({ onPress }): React.ReactNode => {
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
        <div className="virtual--container" data-lenis-prevent>
          <For each={getVirtualItems()}>
            {(virtual) => (
              <NavItem
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
              </NavItem>
            )}
          </For>
        </div>
      </div>
    );
  },
);
NavContent.displayName = "NavContent";

export default NavContent;
