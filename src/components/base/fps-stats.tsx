import React from "react";

interface Props {
  top: number | string;
  right: number | string;
  left: number | string;
  bottom: number | string;
  height: number | string;
  width: number | string;
  translate: { x?: string | number; y?: string | number };
  condition: boolean;
}

const FPSStats: React.FC<Partial<Props>> = ({
  width = 80,
  height = 40,
  top = "auto",
  left = "auto",
  right = "auto",
  bottom = "auto",
  condition = true,
  translate = { x: 0, y: 0 },
}) => {
  const $height = parseInt(String(height));
  const $width = parseInt(String(width));
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const { avgFps, currentFps, fps, maxFps } = useFps($width);

  const colors = React.useMemo(
    () => ({
      red: "rgba(255, 0, 0, 0.5)",
      green: "rgba(0, 255, 0, 0.5)",
      yellow: "rgba(255, 255, 0, 0.5)",
    }),
    [],
  );
  const cssProperties = React.useMemo(
    () =>
      ({
        top: top,
        left: left,
        right: right,
        bottom: bottom,
        height: "fit-content",
        transform: `translate(${translate.x}, ${translate.y})`,
      }) as React.CSSProperties,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  React.useEffect(() => {
    if (canvasRef.current) {
      const context = canvasRef.current.getContext("2d")!;

      context.clearRect(0, 0, $width, $height);
      fps.forEach((frame, index) => {
        const size = { width: 2.5, height: ($height * frame) / maxFps };
        const position = {
          x: $width - (fps.length - index) * size.width,
          y: (size.height - $height) * -1,
        };
        let color: string;
        if (frame > 50) {
          color = colors["green"];
        } else if (frame > 25) {
          color = colors["yellow"];
        } else {
          color = colors["red"];
        }
        context.fillStyle = color;
        context.fillRect(position.x, position.y, size.width, size.height);
      });
    }
  }, [$height, $width, colors, fps, maxFps]);

  if (!condition) return null;

  return (
    <div
      suppressHydrationWarning
      style={cssProperties}
      className="p-2 rounded-[0.5rem] border border-muted bg-card/25 backdrop-blur-xl space-y-2 pointer-events-none fixed z-50 shadow-xs">
      <p className="text-xs font-medium text-primary/80 space-x-0.5">
        <span suppressHydrationWarning>Fps {currentFps}</span>
        <span suppressHydrationWarning>(Avg {avgFps})</span>
      </p>

      <canvas
        height={$height}
        width={$width}
        ref={canvasRef}
        className="bg-indigo-600/25 relative border border-muted rounded-[0.25rem] overflow-hidden"
      />
    </div>
  );
};
FPSStats.displayName = "FPSStats";
export default FPSStats;

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
