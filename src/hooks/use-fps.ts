import React from "react";

const useFps = (width: number) => {
  const oneSecond = 1000;
  const lastFpsValue = React.useRef<number[]>([]);
  const frames = React.useRef<number>(0);
  const prevTime = React.useRef<number>(performance.now());
  const animRef = React.useRef<number>(0);
  const [fps, setFps] = React.useState<number[]>([]);

  const calcFps = React.useCallback(() => {
    const t = performance.now();

    frames.current += 1;
    if (t > prevTime.current + oneSecond) {
      const elapsedTime = t - prevTime.current;
      const currentFps = Math.round((frames.current * oneSecond) / elapsedTime);

      lastFpsValue.current = lastFpsValue.current.concat(currentFps);

      if (elapsedTime > oneSecond + 500) {
        for (let i = 0; i < (elapsedTime - oneSecond) / oneSecond; i++) {
          lastFpsValue.current = lastFpsValue.current.concat(0);
        }
      }

      lastFpsValue.current = lastFpsValue.current.slice(
        Math.max(lastFpsValue.current.length - width, 0),
      );

      setFps(lastFpsValue.current);

      frames.current = 0;
      prevTime.current = performance.now();
    }
    animRef.current = requestAnimationFrame(calcFps);
  }, [width]);

  React.useEffect(() => {
    animRef.current = requestAnimationFrame(calcFps);

    return () => cancelAnimationFrame(animRef.current);
  }, [calcFps]);

  const avgFps = (fps.reduce((a, b) => a + b, 0) / fps.length).toFixed(2);
  const maxFps = Math.max.apply(Math.max, fps);
  const currentFps = fps[fps.length - 1];

  return { fps, avgFps, maxFps, currentFps };
};

export default useFps;
