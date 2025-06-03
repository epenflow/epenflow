import { useGSAP } from "@gsap/react";
import React from "react";
import { BlockSection, Heading, Paragraph } from "~/components/ui/typography";
import LenisLayout from "~/components/utility/lenis-layout";
import { cn } from "~/lib/utils";
import {
  BlurScrollTextFX1,
  BlurScrollTextFX2,
  BlurScrollTextFX3,
  BlurScrollTextFX4,
} from "./blur-scroll-text-fx";

const Page = () => {
  const scope = React.useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const fx1 = scope.current?.querySelector(`[data-fx="1"]`);
      const fx2 = scope.current?.querySelector(`[data-fx="2"]`);
      const fx3 = scope.current?.querySelector(`[data-fx="3"]`);
      const fx4 = scope.current?.querySelector(`[data-fx="4"]`);

      if (!fx1 || !fx2 || !fx3 || !fx4) return;
      new BlurScrollTextFX1(fx1);
      new BlurScrollTextFX2(fx2);
      new BlurScrollTextFX3(fx3);
      new BlurScrollTextFX4(fx4);
    },
    { scope },
  );

  return (
    <LenisLayout>
      <main
        className={cn(
          "[&_section]:min-h-dvh [&_section]:flex [&_section]:flex-col [&_section]:justify-center [&_section]:my-0",
          "mb-10",
        )}
        ref={scope}>
        <BlockSection>
          <Heading className="text-2xl font-medium">Blur Scroll FX</Heading>
          <Paragraph>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolores
            alias repellendus molestiae, ex a delectus non. Voluptatibus
            distinctio, porro in placeat enim eos non repellendus maxime.
            Architecto eius illum nostrum!
          </Paragraph>
        </BlockSection>
        <BlockSection>
          <Heading>Effect 1</Heading>
          <Paragraph data-fx={1} className="text-xl text-pretty">
            {resources.text}
          </Paragraph>
        </BlockSection>
        <BlockSection>
          <Heading>Effect 2</Heading>
          <Paragraph data-fx={2} className="text-xl text-pretty">
            {resources.text}
          </Paragraph>
        </BlockSection>
        <BlockSection>
          <Heading>Effect 3</Heading>
          <Paragraph data-fx={3} className="text-xl text-pretty">
            {resources.text}
          </Paragraph>
        </BlockSection>
        <BlockSection>
          <Heading>Effect 4</Heading>
          <Paragraph data-fx={4} className="text-xl text-pretty">
            {resources.text}
          </Paragraph>
        </BlockSection>
      </main>
    </LenisLayout>
  );
};
export default Page;

const resources = {
  text: `Lorem ipsum dolor, sit amet consectetur adipisicing elit. Sed optio voluptatem, quas voluptate obcaecati laudantium quisquam ad debitis rem. Ratione atque suscipit voluptatum odit? Temporibus facere aperiam provident numquam tenetur.`,
};
