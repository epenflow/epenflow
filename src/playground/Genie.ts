import type { Position } from "react-rnd";
import { toCanvas } from "html-to-image";
import { viewportObserver, type ViewportObserver } from "#/playground/ViewportObserver.ts";
import { hasWindow } from "#/lib/utils.ts";
import { gsap } from "#/lib/gsap.ts";
import { DOCK_SIZE } from "#/lib/constants.ts";

type Direction = "open" | "minimize";

export interface GenieOptions {
  duration?: number;
}

const clamp = gsap.utils.clamp(0, 1);
const lerp = (a: number, b: number, t: number) => gsap.utils.interpolate(a, b, t);
const easeInOutCubic = gsap.parseEase("power2.inOut");
const easeInQuad = gsap.parseEase("power1.in");

const MAX_STRIPS = 160;

const KICKOFF_DURATION = 0.12;

type TargetReact = {
  x: number;
  y: number;
  width: number;
  height: number;
};

function sample(
  r: number,
  rawT: number,
  direction: Direction,
  target: TargetReact,
  position: Position,
  targetWidth: number,
  targetHeight: number,
): {
  left: number;
  right: number;
  destination: number;
} {
  const rowXStart = direction === "minimize" ? (1 - r) * 0.65 : r * 0.65;
  const xE = easeInOutCubic(clamp((rawT - rowXStart) / (1 - rowXStart)));

  const rowYStart = direction === "minimize" ? (1 - r) * 0.2 : r * 0.2;
  const yE = easeInQuad(clamp((rawT - rowYStart) / (1 - rowYStart)));

  const destYBase = position.y + r * targetHeight;

  const dockLeft = target.x;
  const dockRight = target.x + target.width;
  const dockYBase = target.y + r * target.height;

  if (direction === "minimize") {
    return {
      left: lerp(position.x, dockLeft, xE),
      right: lerp(position.x + targetWidth, dockRight, xE),
      destination: lerp(destYBase, dockYBase, yE),
    };
  }
  return {
    left: lerp(dockLeft, position.x, xE),
    right: lerp(dockRight, position.x + targetWidth, xE),
    destination: lerp(dockYBase, destYBase, yE),
  };
}

function render(
  ctx: CanvasRenderingContext2D,
  texture: HTMLCanvasElement,
  containerWidth: number,
  containerHeight: number,
  targetWidth: number,
  targetHeight: number,
  rawT: number,
  direction: Direction,
  target: TargetReact,
  position: Position,
): void {
  ctx.clearRect(0, 0, containerWidth, containerHeight);

  const strips = Math.max(1, Math.min(texture.height, MAX_STRIPS));

  for (let i = 0; i < strips; i++) {
    const r0 = i / strips;
    const r1 = (i + 1) / strips;
    const rMid = (r0 + r1) / 2;

    const yStart = sample(
      r0,
      rawT,
      direction,
      target,
      position,
      targetWidth,
      targetHeight,
    ).destination;
    const yEnd = sample(
      r1,
      rawT,
      direction,
      target,
      position,
      targetWidth,
      targetHeight,
    ).destination;
    const mid = sample(rMid, rawT, direction, target, position, targetWidth, targetHeight);

    const rowWidth = mid.right - mid.left;
    const destHeight = Math.abs(yEnd - yStart) + 1;

    if (rowWidth < 0.8 || destHeight < 0.75) continue;

    const destination = Math.min(yStart, yEnd);

    const srcY = r0 * texture.height;
    const srcHeight = (r1 - r0) * texture.height;

    ctx.drawImage(
      texture,
      0,
      srcY,
      texture.width,
      srcHeight,
      mid.left,
      destination,
      rowWidth,
      destHeight,
    );
  }
}

export class Genie {
  private canvas: HTMLCanvasElement | null = null;
  private texture: HTMLCanvasElement | null = null;
  private tween: gsap.core.Tween | null = null;
  private priming: Promise<HTMLCanvasElement> | null = null;
  private locked = false;
  private readonly duration: number;
  private readonly listeners: Set<VoidFunction> = new Set<VoidFunction>();

  constructor(
    options: GenieOptions = {},
    private readonly viewport: ViewportObserver = viewportObserver,
  ) {
    this.duration = options.duration ?? 420;
  }

  public attach = (canvas: HTMLCanvasElement | null): void => {
    this.canvas = canvas;
  };

  public subscribe = (callback: VoidFunction): VoidFunction => {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  };

  public getSnapshot = (): boolean => this.locked;
  public getServerSnapshot = (): boolean => false;

  public getAnchor = (): TargetReact => {
    const { width, height } = this.viewport.getSnapshot();

    return {
      x: width / 2 - 25,
      y: height,
      width: DOCK_SIZE,
      height: DOCK_SIZE,
    };
  };

  public prime = (node: HTMLElement): void => {
    if (this.locked || this.priming || !hasWindow()) return;

    this.priming = toCanvas(node, { pixelRatio: 1, cacheBust: false })
      .then((texture) => {
        this.texture = texture;
        return texture;
      })
      .finally(() => {
        this.priming = null;
      });
  };

  public minimize = (node: HTMLElement, target: TargetReact, onComplete?: VoidFunction): void => {
    if (this.locked || !this.canvas || !hasWindow()) {
      onComplete?.();
      return;
    }

    this.setBusy(true);
    const rect = node.getBoundingClientRect();

    const primed = this.priming;
    const capture = primed ?? toCanvas(node, { pixelRatio: 1, cacheBust: false });

    if (!primed) {
      gsap.to(node, {
        scale: 0.97,
        opacity: 0.92,
        duration: KICKOFF_DURATION,
        ease: "power1.out",
        transformOrigin: "50% 100%",
      });
    }

    capture
      .then((texture) => {
        this.texture = texture;
        gsap.killTweensOf(node);
        gsap.set(node, { clearProps: "scale,transformOrigin" });
        node.style.opacity = "0";
        node.style.pointerEvents = "none";
        this.animate("minimize", texture, rect, target, () => {
          this.setBusy(false);
          onComplete?.();
        });
      })
      .catch((err) => {
        console.error("Genie snapshot failed:", err);
        gsap.killTweensOf(node);
        gsap.set(node, { clearProps: "scale,transformOrigin" });
        node.style.opacity = "0";
        node.style.pointerEvents = "none";
        this.setBusy(false);
        onComplete?.();
      });
  };

  public restore = (node: HTMLElement, target: TargetReact, onComplete?: VoidFunction): void => {
    if (this.locked || !this.texture || !this.canvas || !hasWindow()) {
      onComplete?.();
      return;
    }

    this.setBusy(true);
    const rect = node.getBoundingClientRect();

    this.animate("open", this.texture, rect, target, () => {
      node.style.opacity = "";
      node.style.pointerEvents = "";
      this.setBusy(false);
      onComplete?.();
    });
  };

  public pause = (): void => {
    this.tween?.pause();
  };

  public resume = (): void => {
    this.tween?.resume();
  };

  public cancel = (): void => {
    this.tween?.kill();
    this.tween = null;
    this.setBusy(false);
  };

  public dispose = (): void => {
    this.cancel();
    this.listeners.clear();
    this.canvas = null;
    this.texture = null;
  };

  private animate(
    direction: Direction,
    texture: HTMLCanvasElement,
    rect: DOMRect,
    target: TargetReact,
    onDone: VoidFunction,
  ): void {
    this.tween?.kill();

    const canvas = this.canvas!;
    const ctx = this.setup(canvas);
    if (!ctx) {
      onDone();
      return;
    }

    const position: Position = {
      x: rect.left,
      y: rect.top,
    };
    const { width: containerWidth, height: containerHeight } = this.viewport.getSnapshot();

    render(
      ctx,
      texture,
      containerWidth,
      containerHeight,
      rect.width,
      rect.height,
      0,
      direction,
      target,
      position,
    );

    const progress = { t: 0 };

    this.tween = gsap.to(progress, {
      t: 1,
      duration: this.duration / 1000,
      ease: "none",
      onUpdate: () => {
        render(
          ctx,
          texture,
          containerWidth,
          containerHeight,
          rect.width,
          rect.height,
          progress.t,
          direction,
          target,
          position,
        );
      },
      onComplete: () => {
        ctx.clearRect(0, 0, containerWidth, containerHeight);
        this.tween = null;
        onDone();
      },
      onInterrupt: () => {
        this.tween = null;
      },
    });
  }

  private setup(canvas: HTMLCanvasElement): CanvasRenderingContext2D | null {
    const dpr = Math.min(hasWindow() ? window.devicePixelRatio || 1 : 1, 2);
    const { width, height } = this.viewport.getSnapshot();

    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    const ctx = canvas.getContext("2d");
    ctx?.setTransform(dpr, 0, 0, dpr, 0, 0);
    return ctx;
  }

  private setBusy(next: boolean): void {
    if (this.locked === next) return;
    this.locked = next;
    this.notify();
  }

  private notify(): void {
    for (const listener of this.listeners) listener();
  }
}
