import React from "react";
import useFps from "~/hooks/use-fps";
import { withMemo } from "~/lib/utils";

type FPSStatsProps = {
  top: number | string;
  right: number | string;
  left: number | string;
  bottom: number | string;
  height: number | string;
  width: number | string;
  translate: { x?: string | number; y?: string | number };
  condition: boolean;
};

const FPSStats: React.FC<Partial<FPSStatsProps>> = withMemo(
  ({
    width = 80,
    height = 40,
    top = "auto",
    left = "auto",
    right = "auto",
    bottom = "auto",
    condition = true,
    translate = { x: 0, y: 0 },
  }) => {
    const { $height, $width } = React.useMemo(
      () => ({
        $height: parseInt(String(height)),
        $width: parseInt(String(width)),
      }),
      [height, width],
    );
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
      [bottom, left, right, translate, top],
    );

    const drawFps = React.useCallback(
      (ctx: CanvasRenderingContext2D) => {
        ctx.clearRect(0, 0, $width, $height);
        let color: string = colors["red"];

        fps.forEach((frame, index) => {
          const size = { width: 2.5, height: ($height * frame) / maxFps };
          const position = {
            x: $width - (fps.length - index) * size.width,
            y: (size.height - $height) * -1,
          };

          if (frame > 50) {
            color = colors["green"];
          } else if (frame > 25) {
            color = colors["yellow"];
          } else {
            color = colors["red"];
          }

          ctx.fillStyle = color;
          ctx.fillRect(position.x, position.y, size.width, size.height);
        });
      },
      [$width, $height, fps, colors, maxFps],
    );

    React.useEffect(() => {
      if (canvasRef.current) {
        const context = canvasRef.current.getContext("2d")!;
        drawFps(context);
      }
    }, [drawFps]);

    if (!condition) return null;

    return (
      <div
        aria-label="FPS Meter"
        suppressHydrationWarning
        style={cssProperties}
        className="p-2 rounded-[0.5rem] border border-muted bg-card space-y-2 pointer-events-none fixed z-50 shadow-xs">
        <p
          aria-label={`Fps ${currentFps}(Avg ${avgFps})`}
          className="text-xs font-medium text-primary/80 space-x-0.5">
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
  },
);
FPSStats.displayName = "FPSStats";
export default FPSStats;
