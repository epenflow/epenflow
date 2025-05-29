import { useGSAP } from "@gsap/react";
import gsap, { SplitText } from "gsap/all";
import React from "react";
import { BlockSection, Heading } from "~/components/ui/typography";
import For from "~/components/utility/for";

const Page = () => {
  const scope = React.useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const words: HTMLHeadingElement[] = gsap.utils.toArray("[data-word]");

      const splits = words.map(
        (word) =>
          new SplitText(word, {
            type: "chars",
          }),
      );

      const fChar = splits[0];
      const duration = 0.5;
      const stagger = duration / resources.words.length;
      const pause = 1;

      const tl = gsap.timeline({
        repeat: -1,
      });

      splits.forEach((split, index) => {
        if (index) {
          gsap.set(split.chars, {
            yPercent: 100,
            autoAlpha: 0,
          });
        }

        const next = splits[index + 1];
        tl.to(
          split.chars,
          {
            yPercent: -100,
            autoAlpha: 0,
            duration,
            stagger,
            ease: "power1.inOut",
          },
          "+=" + pause,
        );

        if (next) {
          tl.to(
            next.chars,
            {
              yPercent: 0,
              autoAlpha: 1,
              duration,
              stagger,
            },
            "<",
          );
        }
      });

      tl.fromTo(
        fChar.chars,
        {
          yPercent: 100,
          autoAlpha: 0,
        },
        {
          autoAlpha: 1,
          yPercent: 0,
          duration,
          stagger,
          immediateRender: false,
        },
        "<",
      );
    },
    { scope },
  );

  return (
    <main ref={scope} className="h-dvh flex">
      <BlockSection className="relative my-0">
        <For
          each={resources.words}
          children={(word, key) => (
            <Heading
              key={`${word}-${key}`}
              level={1}
              data-word={word}
              className="m-0 leading-normal overflow-hidden font-medium absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2">
              {word}
            </Heading>
          )}
        />
      </BlockSection>
    </main>
  );
};
export default Page;

const resources = {
  words: [
    "Hello",
    "Halo",
    "Hola",
    "Bonjour",
    "Hallo",
    "Ciao",
    "こんにちは",
    "안녕하세요",
    "你好",
    "Olá",
    "Привет",
    "مرحبا",
    "हैलो",
  ],
};
