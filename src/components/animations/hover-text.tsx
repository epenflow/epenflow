import { useGSAP } from "@gsap/react";
import gsap from "gsap/all";
import React from "react";
import { paragraphVariants } from "~/components/ui/typography";
import For from "~/components/utility/for";
import { cn } from "~/lib/utils";

type HoverText = React.ComponentProps<"div">;
const HoverText: React.FC<HoverText> = ({ className, children, ...props }) => {
  const scope = React.useRef<HTMLDivElement>(null);
  useGSAP(
    () => {
      if (!scope.current) return;

      const underline = scope.current.querySelector(
        "[data-underline]",
      ) as HTMLSpanElement;
      const grid: HTMLSpanElement[] = gsap.utils.toArray("[data-grid-span]");
      const duration = 0.5;

      gsap.set(underline, {
        clipPath: "polygon(0 0, 0 0, 0 100%, 0% 100%)",
      });
      gsap.set(grid[0], {
        yPercent: 100,
        scaleY: 0.5,
      });
      const tlGrid = gsap
        .timeline({ paused: true })
        .to(grid[1], {
          yPercent: -100,
          scaleY: -0.5,
          duration,
          ease: "power1.in",
        })
        .to(
          grid[0],
          {
            yPercent: 0,
            scaleY: 1,
            duration,
            ease: "power1.out",
          },
          "<",
        );

      const tlIn = gsap.timeline({ paused: true });
      tlIn.to(underline, {
        clipPath: "polygon(0 0, 100% 0, 100% 100%, 0% 100%)",
        ease: "power2.out",
        duration,
      });

      const tlOut = gsap.timeline({ paused: true });
      tlOut.to(underline, {
        clipPath: "polygon(100% 0, 100% 0, 100% 100%, 100% 100%)",
        ease: "power2.in",
        duration,
      });

      scope.current.addEventListener("mouseenter", () => {
        if (tlOut.isActive()) {
          tlOut.progress(1).kill();
        }
        if (!tlIn.isActive()) {
          tlIn.play(0);
        }
        if (tlGrid.reversed()) {
          tlGrid.play();
        } else if (!tlGrid.isActive() && tlGrid.progress() === 0) {
          tlGrid.play();
        }
      });
      scope.current.addEventListener("mouseleave", () => {
        if (tlIn.isActive()) {
          tlIn.progress(1).kill();
        }
        if (!tlOut.isActive()) {
          tlOut.play(0);
        }

        if (!tlGrid.reversed()) {
          tlGrid.reverse();
        }
      });
    },
    { scope },
  );

  return (
    <div ref={scope} className={cn("w-fit block group", className)} {...props}>
      <span
        data-grid-container
        className={cn(
          "grid [&_span]:[grid-area:1/1] leading-normal overflow-y-hidden perspective-dramatic space-y-0",
          paragraphVariants(),
        )}>
        <For
          each={Array.from({ length: 2 })}
          children={(_, key) => (
            <span key={key} data-grid-span>
              {children}
            </span>
          )}
        />
      </span>
      <span
        data-underline
        className="block w-full h-[1px] bg-primary/80 [clip-path:polygon(0_0,_100%_0,_100%_100%,_0%_100%)]"
      />
    </div>
  );
};
export default HoverText;
