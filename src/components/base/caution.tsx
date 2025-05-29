import { useGSAP } from "@gsap/react";
import gsap from "gsap/all";
import React from "react";
import { cn } from "~/lib/utils";

type HTextProps = React.ComponentProps<"h1">;
const HText: React.FC<HTextProps> = ({ className, ...props }) => {
  return (
    <h1
      className={cn("text-3xl lg:text-5xl font-bold text-center", className)}
      {...props}
    />
  );
};
type PTextProps = React.ComponentProps<"p">;
const PText: React.FC<PTextProps> = ({ className, ...props }) => {
  return (
    <p
      className={cn(
        "text-xs max-w-sm text-center font-bold text-primary leading-none",
        className,
      )}
      {...props}
    />
  );
};

const Caution = () => {
  const scope = React.useRef<HTMLDivElement>(null);
  useGSAP(
    () => {
      gsap.from(scope.current, {
        autoAlpha: 0,
        scale: 0.025,
        duration: 1,
        rotate: 45,
        ease: "power2.out",
      });
    },
    { scope },
  );

  return (
    <div
      ref={scope}
      className={cn(
        "[--caution-bg:#F7D417] bg-(--caution-bg) text-primary z-50",
        "w-fit m-auto p-2 uppercase fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 space-y-2",
      )}>
      <div>
        <HText className="text-5xl lg:text-6xl bg-black text-[var(--caution-bg)]">
          CAUTION
        </HText>
        <HText>CONSTRUCTION</HText>
        <HText>AREA</HText>
        <HText>AUTHORIZED</HText>
        <HText>PERSONNEL ONLY</HText>
      </div>
      <PText>
        this new site is undergoing construction, please be careful if there is
        suspicious activity
      </PText>
    </div>
  );
};
export default Caution;
