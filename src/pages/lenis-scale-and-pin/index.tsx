import { useRect, useWindowSize } from "hamo";
import { ReactLenis, useLenis } from "lenis/react";
import React from "react";
import { clamp, mapRange } from "~/lib/math";
import "./base.css";

const Page = () => {
  const scope = React.useRef<HTMLElement>(null);
  const zoomRef = React.useRef<HTMLElement>(null);

  const [zoomWrapperRectRef, zoomWrapperRect] = useRect({
    lazy: true,
    callback(rect) {
      console.log(rect);
    },
  });
  const { height: wHeight } = useWindowSize();

  useLenis(({ scroll }) => {
    const zTop = zoomWrapperRect().top;
    const zHeight = zoomWrapperRect().height;

    if (!zTop || !zHeight || !wHeight) return;

    const start = zTop + wHeight * 0.5;
    const end = zTop + zHeight - wHeight;

    console.log(start, end);

    const progress = clamp(0, mapRange(start, end, scroll, 0, 1), 1);
    const center = 0.6;
    const progress1 = clamp(0, mapRange(0, center, progress, 0, 1), 1);
    const progress2 = clamp(0, mapRange(center - 0.055, 1, progress, 0, 1), 1);
    const positionX = mapRange(0, 1, clamp(0, progress * 2, 1), -54.2, -85);

    zoomRef.current?.style.setProperty("--progress1", String(progress1));
    zoomRef.current?.style.setProperty("--progress2", String(progress2));
    zoomRef.current?.style.setProperty("--positionX", `${positionX}%`);
  });

  return (
    <>
      <ReactLenis root />
      <main ref={scope}>
        <section className="home__spacer" />
        <section
          ref={(node) => {
            console.log(node);
            zoomWrapperRectRef(node);
            zoomRef.current = node;
          }}
          className="home__hero">
          <div className="home__inner">
            <div className="home__zoom">
              <h1 className="home__first h1">
                so we built <br />
                <span>web scrolling</span>
              </h1>
              <h1 className="home__enter h3">
                enter <br />
                lenis
              </h1>
              <h1 className="home__last h1">as it should be</h1>
            </div>
          </div>
        </section>
        <section className="home__spacer" />
      </main>
    </>
  );
};
export default Page;
