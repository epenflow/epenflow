import gsap from "gsap/all";
import { Lenis, type LenisProps, type LenisRef } from "lenis/react";
import React from "react";

type LenisLayoutProps = LenisProps;
const LenisLayout: React.FC<LenisLayoutProps> = ({ options, ...props }) => {
  const ref = React.useRef<LenisRef>(null);

  React.useEffect(() => {
    function update(time: number) {
      ref.current?.lenis?.raf(time * 1000);
    }
    gsap.ticker.add(update);

    return () => {
      gsap.ticker.remove(update);
    };
  }, []);

  return (
    <Lenis ref={ref} root options={{ autoRaf: false, ...options }} {...props} />
  );
};
export default LenisLayout;
