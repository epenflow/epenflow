import type { Position } from "react-rnd";
import { toCanvas } from "html-to-image";
import { viewportObserver, type ViewportObserver } from "#/playground/ViewportObserver.ts";
import { hasWindow } from "#/lib/utils.ts";
import type { Systems } from "#/lib/types.ts";
import { gsap } from "#/lib/gsap.ts";

type Phase = "open" | "minimize";

const ANIMATION_DEFAULTS = {
  duration: 420,
  stripCount: 500,
  kickoffDuration: 0.12,
  xProgressDelay: 0.65,
  yProgressDelay: 0.2,
  xEasing: "power2.inOut",
  yEasing: "power1.in",
  kickoffEasing: "power1.out",
} as const;

const ANIMATION_THRESHOLDS = {
  minWidth: 0.8,
  minHeight: 0.75,
  maxPixelRatio: 2,
  minPixelRatio: 1,
} as const;

const KICKOFF_ANIMATION = {
  scale: 0.97,
  opacity: 0.92,
  transformOrigin: "50% 100%",
} as const;
const ANCHOR_SIZE = { width: 48, height: 48 } as const;

type Rect = Systems.Window.Position & Systems.Window.Size;

type AnimationState = {
  left: number;
  right: number;
  destination: number;
};

type AnimationLifecycleHooks = {
  onBeforeAnimation?: (phase: Phase) => void;
  onAfterAnimation?: (phase: Phase) => void;
  onAnimationError?: (error: Error, phase: Phase) => void;
};

export interface GenieOptions extends AnimationLifecycleHooks {
  duration?: number;

  stripCount?: number;

  kickoffDuration?: number;

  xProgressDelay?: number;

  yProgressDelay?: number;

  xAxisEasing?: string;

  yAxisEasing?: string;

  kickoffEasing?: string;

  kickoffScale?: number;

  kickoffOpacity?: number;

  pixelRatio?: number;

  enableTextureCache?: boolean;

  enableErrorLogging?: boolean;

  anchorSize?: Systems.Window.Size;
}

export class WindowGenie {
  private canvas: HTMLCanvasElement | null = null;
  private texture: HTMLCanvasElement | null = null;
  private activeAnimationTween: gsap.core.Tween | null = null;
  private texturePrimingPromise: Promise<HTMLCanvasElement> | null = null;
  private isAnimating = false;

  private readonly config: {
    readonly duration: number;
    readonly stripCount: number;
    readonly kickoffDuration: number;
    readonly xProgressDelay: number;
    readonly yProgressDelay: number;
    readonly xAxisEasing: string;
    readonly yAxisEasing: string;
    readonly kickoffEasing: string;
    readonly kickoffScale: number;
    readonly kickoffOpacity: number;
    readonly pixelRatio: number;
    readonly enableTextureCache: boolean;
    readonly enableErrorLogging: boolean;
    readonly anchorSize: Systems.Window.Size;
  };

  private readonly onBeforeAnimation?: (phase: Phase) => void;
  private readonly onAfterAnimation?: (phase: Phase) => void;
  private readonly onAnimationError?: (error: Error, phase: Phase) => void;

  private readonly viewport: ViewportObserver;

  private readonly xAxisEaseFunction: gsap.EaseFunction;
  private readonly yAxisEaseFunction: gsap.EaseFunction;
  private readonly kickoffEaseFunction: gsap.EaseFunction;

  private readonly listeners: Set<VoidFunction> = new Set<VoidFunction>();

  constructor(options: GenieOptions = {}) {
    this.viewport = viewportObserver;

    this.config = {
      duration: options.duration ?? ANIMATION_DEFAULTS.duration,
      stripCount: Math.max(1, Math.min(options.stripCount ?? ANIMATION_DEFAULTS.stripCount, 1000)),
      kickoffDuration: options.kickoffDuration ?? ANIMATION_DEFAULTS.kickoffDuration,
      xProgressDelay: this.clampProgressValue(
        options.xProgressDelay ?? ANIMATION_DEFAULTS.xProgressDelay,
      ),
      yProgressDelay: this.clampProgressValue(
        options.yProgressDelay ?? ANIMATION_DEFAULTS.yProgressDelay,
      ),
      xAxisEasing: options.xAxisEasing ?? ANIMATION_DEFAULTS.xEasing,
      yAxisEasing: options.yAxisEasing ?? ANIMATION_DEFAULTS.yEasing,
      kickoffEasing: options.kickoffEasing ?? ANIMATION_DEFAULTS.kickoffEasing,
      kickoffScale: options.kickoffScale ?? KICKOFF_ANIMATION.scale,
      kickoffOpacity: options.kickoffOpacity ?? KICKOFF_ANIMATION.opacity,
      pixelRatio: this.normalizePixelRatio(options.pixelRatio),
      enableTextureCache: options.enableTextureCache ?? false,
      enableErrorLogging: options.enableErrorLogging ?? true,
      anchorSize: options.anchorSize ?? ANCHOR_SIZE,
    };

    this.onBeforeAnimation = options.onBeforeAnimation;
    this.onAfterAnimation = options.onAfterAnimation;
    this.onAnimationError = options.onAnimationError;

    this.xAxisEaseFunction = gsap.parseEase(this.config.xAxisEasing);
    this.yAxisEaseFunction = gsap.parseEase(this.config.yAxisEasing);
    this.kickoffEaseFunction = gsap.parseEase(this.config.kickoffEasing);
  }

  private calculateStripAnimationState(
    stripFraction: number,
    animationProgress: number,
    phase: Phase,
    dockRect: Rect,
    elementPosition: Position,
    elementWidth: number,
    elementHeight: number,
  ): AnimationState {
    // Calculate progress with delays
    const xDelayFactor = phase === "minimize" ? 1 - stripFraction : stripFraction;
    const xProgressWithDelay = xDelayFactor * this.config.xProgressDelay;
    const xProgressEased = this.xAxisEaseFunction(
      this.clampProgress((animationProgress - xProgressWithDelay) / (1 - xProgressWithDelay)),
    );

    const yDelayFactor = phase === "minimize" ? 1 - stripFraction : stripFraction;
    const yProgressWithDelay = yDelayFactor * this.config.yProgressDelay;
    const yProgressEased = this.yAxisEaseFunction(
      this.clampProgress((animationProgress - yProgressWithDelay) / (1 - yProgressWithDelay)),
    );

    // Calculate positions
    const elementStartY = elementPosition.y + stripFraction * elementHeight;
    const dockStartX = dockRect.x;
    const dockEndX = dockRect.x + dockRect.width;
    const dockStartY = dockRect.y + stripFraction * dockRect.height;

    if (phase === "minimize") {
      return {
        left: this.lerp(elementPosition.x, dockStartX, xProgressEased),
        right: this.lerp(elementPosition.x + elementWidth, dockEndX, xProgressEased),
        destination: this.lerp(elementStartY, dockStartY, yProgressEased),
      };
    }

    return {
      left: this.lerp(dockStartX, elementPosition.x, xProgressEased),
      right: this.lerp(dockEndX, elementPosition.x + elementWidth, xProgressEased),
      destination: this.lerp(dockStartY, elementStartY, yProgressEased),
    };
  }

  private renderAnimationFrame(
    renderContext: CanvasRenderingContext2D,
    sourceTexture: HTMLCanvasElement,
    viewportWidth: number,
    viewportHeight: number,
    elementWidth: number,
    elementHeight: number,
    animationProgress: number,
    phase: Phase,
    dockRect: Rect,
    elementPosition: Position,
  ): void {
    renderContext.clearRect(0, 0, viewportWidth, viewportHeight);

    const activeStripCount = Math.max(1, Math.min(sourceTexture.height, this.config.stripCount));

    for (let stripIndex = 0; stripIndex < activeStripCount; stripIndex++) {
      const stripStartFraction = stripIndex / activeStripCount;
      const stripEndFraction = (stripIndex + 1) / activeStripCount;
      const stripMidFraction = (stripStartFraction + stripEndFraction) / 2;

      const stripTopPosition = this.calculateStripAnimationState(
        stripStartFraction,
        animationProgress,
        phase,
        dockRect,
        elementPosition,
        elementWidth,
        elementHeight,
      ).destination;

      const stripBottomPosition = this.calculateStripAnimationState(
        stripEndFraction,
        animationProgress,
        phase,
        dockRect,
        elementPosition,
        elementWidth,
        elementHeight,
      ).destination;

      const stripMiddleState = this.calculateStripAnimationState(
        stripMidFraction,
        animationProgress,
        phase,
        dockRect,
        elementPosition,
        elementWidth,
        elementHeight,
      );

      const renderedWidth = stripMiddleState.right - stripMiddleState.left;
      const renderedHeight = Math.abs(stripBottomPosition - stripTopPosition) + 1;

      if (
        renderedWidth < ANIMATION_THRESHOLDS.minWidth ||
        renderedHeight < ANIMATION_THRESHOLDS.minHeight
      ) {
        continue;
      }

      const renderDestinationY = Math.min(stripTopPosition, stripBottomPosition);

      const textureSourceY = stripStartFraction * sourceTexture.height;
      const textureSourceHeight = (stripEndFraction - stripStartFraction) * sourceTexture.height;

      renderContext.drawImage(
        sourceTexture,
        0,
        textureSourceY,
        sourceTexture.width,
        textureSourceHeight,
        stripMiddleState.left,
        renderDestinationY,
        renderedWidth,
        renderedHeight,
      );
    }
  }

  public attach = (canvas: HTMLCanvasElement | null): void => {
    this.canvas = canvas;
  };

  public subscribe = (callback: VoidFunction): VoidFunction => {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  };

  public getSnapshot = (): boolean => this.isAnimating;
  public getServerSnapshot = (): boolean => false;

  public getAnchor = (): Rect => {
    const viewport = this.viewport.getSnapshot();
    const anchor = this.config.anchorSize;

    return {
      x: viewport.width / 2 - anchor.width / 2,
      y: viewport.height - anchor.height,
      width: anchor.width,
      height: anchor.height,
    };
  };

  public prime = (elementNode: HTMLElement): void => {
    if (this.isAnimating || this.texturePrimingPromise || !hasWindow()) {
      return;
    }

    this.texturePrimingPromise = toCanvas(elementNode, {
      pixelRatio: this.config.pixelRatio,
      cacheBust: false,
      style: {
        boxShadow: "none",
        border: "none",
        margin: "0",
      },
    })
      .then((renderedTexture) => {
        this.texture = renderedTexture;
        return renderedTexture;
      })
      .finally(() => {
        this.texturePrimingPromise = null;
      });
  };

  public minimize = (
    elementNode: HTMLElement,
    dockTarget: Rect,
    onComplete?: VoidFunction,
  ): void => {
    if (this.isAnimating || !this.canvas || !hasWindow()) {
      onComplete?.();
      return;
    }

    this.onBeforeAnimation?.("minimize");
    this.setAnimatingState(true);

    const elementBoundingRect = elementNode.getBoundingClientRect();
    const existingTexture = this.texturePrimingPromise;
    const textureCapture =
      existingTexture ??
      toCanvas(elementNode, {
        pixelRatio: this.config.pixelRatio,
        cacheBust: false,
        style: {
          boxShadow: "none",
          border: "none",
          margin: "0",
        },
      });

    if (!existingTexture) {
      gsap.to(elementNode, {
        scale: this.config.kickoffScale,
        opacity: this.config.kickoffOpacity,
        duration: this.config.kickoffDuration,
        ease: this.kickoffEaseFunction,
        transformOrigin: KICKOFF_ANIMATION.transformOrigin,
      });
    }

    textureCapture
      .then((capturedTexture) => {
        this.texture = capturedTexture;
        gsap.killTweensOf(elementNode);
        gsap.set(elementNode, {
          clearProps: "scale,transformOrigin",
          opacity: 0,
          pointerEvents: "none",
        });

        this.performAnimation("minimize", capturedTexture, elementBoundingRect, dockTarget, () => {
          this.setAnimatingState(false);
          this.onAfterAnimation?.("minimize");
          onComplete?.();
        });
      })
      .catch((error) => {
        const minimizeError = new Error(`Genie minimize failed: ${error.message}`);
        if (this.config.enableErrorLogging) {
          console.error(minimizeError);
        }
        this.onAnimationError?.(minimizeError, "minimize");

        gsap.killTweensOf(elementNode);
        gsap.set(elementNode, {
          clearProps: "scale,transformOrigin",
          opacity: 0,
          pointerEvents: "none",
        });

        this.setAnimatingState(false);
        onComplete?.();
      });
  };

  public restore = (
    elementNode: HTMLElement,
    dockSource: Rect,
    onComplete?: VoidFunction,
  ): void => {
    if (this.isAnimating || !this.texture || !this.canvas || !hasWindow()) {
      onComplete?.();
      return;
    }

    this.onBeforeAnimation?.("open");
    this.setAnimatingState(true);

    const elementBoundingRect = elementNode.getBoundingClientRect();

    this.performAnimation("open", this.texture, elementBoundingRect, dockSource, () => {
      elementNode.style.opacity = "";
      elementNode.style.pointerEvents = "";
      this.setAnimatingState(false);
      this.onAfterAnimation?.("open");
      onComplete?.();
    });
  };

  public pause = (): void => {
    this.activeAnimationTween?.pause();
  };

  public resume = (): void => {
    this.activeAnimationTween?.resume();
  };

  public cancel = (): void => {
    this.activeAnimationTween?.kill();
    this.activeAnimationTween = null;
    this.setAnimatingState(false);
  };

  public dispose = (): void => {
    this.cancel();
    this.listeners.clear();
    this.canvas = null;

    if (!this.config.enableTextureCache) {
      this.texture = null;
    }
  };

  // ==================== PRIVATE HELPERS ====================

  /**
   * Execute the actual animation
   */
  private performAnimation(
    phase: Phase,
    sourceTexture: HTMLCanvasElement,
    elementRect: DOMRect,
    targetRect: Rect,
    onAnimationComplete: VoidFunction,
  ): void {
    this.activeAnimationTween?.kill();

    const renderCanvas = this.canvas!;
    const renderContext = this.initializeRenderContext(renderCanvas);

    if (!renderContext) {
      onAnimationComplete();
      return;
    }

    const elementPosition: Position = {
      x: elementRect.left,
      y: elementRect.top,
    };

    const { width: viewportWidth, height: viewportHeight } = this.viewport.getSnapshot();

    // Render initial frame
    this.renderAnimationFrame(
      renderContext,
      sourceTexture,
      viewportWidth,
      viewportHeight,
      elementRect.width,
      elementRect.height,
      0,
      phase,
      targetRect,
      elementPosition,
    );

    // Create progress object for GSAP animation
    const animationProgress = { value: 0 };

    this.activeAnimationTween = gsap.to(animationProgress, {
      value: 1,
      duration: this.config.duration / 1000,
      ease: "none",
      onUpdate: () => {
        this.renderAnimationFrame(
          renderContext,
          sourceTexture,
          viewportWidth,
          viewportHeight,
          elementRect.width,
          elementRect.height,
          animationProgress.value,
          phase,
          targetRect,
          elementPosition,
        );
      },
      onComplete: () => {
        renderContext.clearRect(0, 0, viewportWidth, viewportHeight);
        this.activeAnimationTween = null;
        onAnimationComplete();
      },
      onInterrupt: () => {
        this.activeAnimationTween = null;
      },
    });
  }

  private initializeRenderContext(canvas: HTMLCanvasElement): CanvasRenderingContext2D | null {
    const devicePixelRatio = this.config.pixelRatio;
    const { width: viewportWidth, height: viewportHeight } = this.viewport.getSnapshot();

    canvas.width = viewportWidth * devicePixelRatio;
    canvas.height = viewportHeight * devicePixelRatio;
    canvas.style.width = `${viewportWidth}px`;
    canvas.style.height = `${viewportHeight}px`;

    const renderContext = canvas.getContext("2d");
    renderContext?.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);

    return renderContext;
  }

  private lerp(startValue: number, endValue: number, progress: number): number {
    return gsap.utils.interpolate(startValue, endValue, progress);
  }

  private clampProgress(value: number): number {
    return gsap.utils.clamp(0, 1)(value);
  }

  private clampProgressValue(value: number): number {
    return gsap.utils.clamp(0, 1)(value);
  }

  private normalizePixelRatio(pixelRatio?: number): number {
    if (!hasWindow()) {
      return ANIMATION_THRESHOLDS.minPixelRatio;
    }

    const detectedRatio = pixelRatio ?? (window.devicePixelRatio || 1);
    return gsap.utils.clamp(
      ANIMATION_THRESHOLDS.minPixelRatio,
      ANIMATION_THRESHOLDS.maxPixelRatio,
    )(detectedRatio);
  }

  private setAnimatingState(isNowAnimating: boolean): void {
    if (this.isAnimating === isNowAnimating) {
      return;
    }

    this.isAnimating = isNowAnimating;
    this.notifyStateListeners();
  }

  private notifyStateListeners(): void {
    for (const listener of this.listeners) {
      listener();
    }
  }
}
