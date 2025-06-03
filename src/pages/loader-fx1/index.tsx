import { useGSAP } from "@gsap/react";
import gsap, { SplitText } from "gsap/all";
import React from "react";
import { Heading } from "~/components/ui/typography";
import For from "~/components/utility/for";
import { cn } from "~/lib/utils";

const Page = () => {
  const scope = React.useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (!scope.current) return;

      const stagger: gsap.StaggerVars = {
        each: 0.02,
        from: "center",
      };
      const tl = gsap.timeline({
        defaults: {
          ease: "none",
        },
      });

      const headingTweenVars: gsap.TweenVars = {
        stagger,
        duration: 1.4,
        ease: "power4.inOut",
      };
      const loaderTweenVars: gsap.TweenVars = {
        height: "0%",
        ease: "power4.inOut",
        duration: 1.4,
        stagger: (index, _, list) => {
          const center = (list.length - 1) / 2;
          const delay = Math.abs(index - center) * 0.03;
          const odd = index % 2 ? 0.08 : 0;
          return delay + odd;
        },
      };

      const heading = SplitText.create("[data-heading]", {
        type: "chars",
      });
      const headingSelector = gsap.utils.selector(heading.elements);

      const evenHeading = headingSelector("div:nth-of-type(2n)");
      const oddHeading = headingSelector("div:nth-of-type(2n+1)");

      gsap.set(heading.chars, {
        yPercent: (i) => (i % 2 ? -100 : 100),
      });

      tl.to(heading.chars, {
        yPercent: 0,
        duration: 1.8,
        ease: "power4.inOut",
        stagger,
      })
        .to(evenHeading, {
          yPercent: -100,
          delay: 0.25,
          ...headingTweenVars,
        })
        .to(
          oddHeading,
          {
            yPercent: 100,
            ...headingTweenVars,
          },
          "<",
        )
        .to(".loader--top > .loader--item", loaderTweenVars, "<0.6")
        .to(".loader--bottom > .loader--item", loaderTweenVars, "<");
    },
    { scope },
  );

  return (
    <main
      ref={scope}
      className={cn(
        "[&_.loader]:absolute [&_.loader]:left-0 [&_.loader]:w-full [&_.loader]:h-1/2 [&_.loader]:flex",
        "[&_.loader--top]:top-0 [&_.loader--bottom]:bottom-0 [&_.loader--bottom]:items-end",
        "[&_.loader--item]:w-[5%] [&_.loader--item]:h-full [&_.loader--item]:bg-background",
        "relative min-h-dvh w-full bg-foreground",
      )}>
      <Heading
        data-heading
        className="absolute top-1/2 left-1/2 -translate-1/2 font-medium z-10 text-foreground overflow-hidden"
        level={1}>
        HELLO
      </Heading>
      <section className="loader loader--top">
        <For
          each={Array.from({ length: 20 })}
          children={(_, key) => <div key={key} className="loader--item" />}
        />
      </section>
      <section className="loader loader--bottom">
        <For
          each={Array.from({ length: 20 })}
          children={(_, key) => <div key={key} className="loader--item" />}
        />
      </section>
    </main>
  );
};
export default Page;
