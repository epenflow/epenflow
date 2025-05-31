import { useGSAP } from "@gsap/react";
import { Link } from "@tanstack/react-router";
import { useVirtualizer, type VirtualItem } from "@tanstack/react-virtual";
import gsap from "gsap/all";
import React from "react";
import HoverText from "~/components/animations/hover-text";
import For from "~/components/utility/for";
import { cn, withMemo } from "~/lib/utils";
import NAV_ITEM_CONTENTS from "./contents";

type NavItemProps = {
  virtual: VirtualItem;
  onClick: VoidFunction;
};
const NavItem: React.FC<NavItemProps> = ({ virtual, ...props }) => {
  const scope = React.useRef<HTMLAnchorElement>(null);
  const cssProperties = React.useMemo<React.CSSProperties>(
    () =>
      ({
        "--virtual-height": `${virtual.size}px`,
        "--virtual-y-axis": `${virtual.start}px`,
      }) as React.CSSProperties,
    [virtual.size, virtual.start],
  );

  useGSAP(
    () => {
      gsap.fromTo(
        "[data-anim]",
        {
          autoAlpha: 0,
          xPercent: virtual.index % 2 === 0 ? -100 : 100,
        },
        {
          autoAlpha: 1,
          xPercent: 0,
          ease: "sine.inOut",
        },
      );
    },
    { scope },
  );

  return (
    <Link
      ref={scope}
      style={{ ...cssProperties }}
      className={cn("virtual--item overflow-clip flex flex-col items-start")}
      to={NAV_ITEM_CONTENTS[virtual.index].to}
      {...props}>
      <HoverText
        data-anim
        aria-label={NAV_ITEM_CONTENTS[virtual.index].label}
        className="[&_[data-grid-span]]:line-clamp-1">
        {NAV_ITEM_CONTENTS[virtual.index].label}
      </HoverText>
    </Link>
  );
};

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
      count: NAV_ITEM_CONTENTS.length,
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
        <div className="virtual--container overflow-x-clip" data-lenis-prevent>
          <For each={getVirtualItems()}>
            {(virtual) => (
              <NavItem onClick={onPress} key={virtual.key} virtual={virtual} />
            )}
          </For>
        </div>
      </div>
    );
  },
);
NavContent.displayName = "NavContent";

export default NavContent;
