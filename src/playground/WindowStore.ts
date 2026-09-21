import { viewportObserver, type ViewportObserver } from "#/playground/ViewportObserver.ts";
import type { Systems } from "#/lib/types.ts";
import { gsap } from "#/lib/gsap.ts";

type Snapshot = {
  position: Systems.Window.Position;
  size: Systems.Window.Size;
};

type AnimateOptions = Partial<Systems.Window.Size & Systems.Window.Position> & {
  duration?: number;
  ease?: gsap.EaseString | gsap.EaseFunction;
  onComplete?: VoidFunction;
};

export class WindowStore {
  private isAnimating: boolean = false;
  private tween: gsap.core.Tween | null = null;
  private snapshot: Snapshot | null = null;

  private readonly listeners: Set<VoidFunction> = new Set<VoidFunction>();

  constructor(
    private current: Snapshot,
    private viewport: ViewportObserver = viewportObserver,
  ) {}

  public getSnapshot = (): Snapshot => this.current;

  public getServerSnapshot = (): Snapshot => ({
    position: { x: 0, y: 0 },
    size: this.viewport.getServerSnapshot(),
  });

  public subscribe = (callback: VoidFunction): VoidFunction => {
    this.listeners.add(callback);

    return () => this.listeners.delete(callback);
  };

  public getViewportSnapshot = (): Systems.Window.Size => this.viewport.getSnapshot();
  public getViewportServerSnapshot = () => this.viewport.getServerSnapshot();

  public subscribeToViewport = (callback: VoidFunction): VoidFunction => {
    return this.viewport.subscribe(callback);
  };

  public getIsAnimatingSnapshot = (): boolean => this.isAnimating;
  public getIsAnimatingServerSnapshot = (): boolean => false;

  public setState = (updater: ((prev: Snapshot) => Snapshot) | Snapshot): void => {
    const updated = typeof updater === "function" ? updater(this.current) : updater;

    if (
      this.current.position.x === updated.position.x &&
      this.current.position.y === updated.position.y &&
      this.current.size.width === updated.size.width &&
      this.current.size.height === updated.size.height
    ) {
      return;
    }

    this.current = updated;
    this.notify();
  };

  public setPosition = (position: Systems.Window.Position): void => {
    this.setState((prev) =>
      prev.position.x === position.x && prev.position.y === position.y
        ? prev
        : { ...prev, position },
    );
  };

  public setSize = (size: Systems.Window.Size): void => {
    this.setState((prev) =>
      prev.size.width === size.width && prev.size.height === size.height ? prev : { ...prev, size },
    );
  };

  public cancelAnimation = (): void => {
    this.tween?.kill();
    this.tween = null;
    this.setAnimating(false);
  };
  // public minimize = (
  //   position: Systems.Window.Position,
  //   scale: number,
  //   options: AnimateOptions = {},
  // ): void => {
  //   const width = this.current.size.width * scale,
  //     height = this.current.size.height * scale;

  //   this.animate({
  //     ...options,
  //     x: position.x - width / 2,
  //     y: position.y - height,
  //     width,
  //     height,
  //   });
  // };
  public minimize = (
    props: Systems.Window.Position & Systems.Window.Size,
    options: AnimateOptions = {},
  ): void => {
    this.animate({
      ...options,
      ...props,
    });
  };
  public maximize = (
    props: Systems.Window.Size & Partial<Systems.Window.Position>,
    options: AnimateOptions = {},
  ): void => {
    this.animate({
      ...options,
      ...props,
    });
  };

  public restore(): void;
  public restore(options: AnimateOptions): void;
  public restore(props: Snapshot, options?: AnimateOptions): void;
  public restore(propsOrOptions?: Snapshot | AnimateOptions, options: AnimateOptions = {}): void {
    if (!propsOrOptions) {
      if (!this.snapshot) return;
      this.animate({
        ...this.snapshot.position,
        ...this.snapshot.size,
      });
      return;
    }

    if ("position" in propsOrOptions && "size" in propsOrOptions) {
      this.animate({
        ...options,
        ...propsOrOptions.position,
        ...propsOrOptions.size,
      });
    } else {
      if (!this.snapshot) return;
      this.animate({
        ...propsOrOptions,
        ...this.snapshot.position,
        ...this.snapshot.size,
      });
    }
  }

  public restoreSnapshotWithTransition = (options: AnimateOptions = {}): void => {
    if (!this.snapshot) return;

    this.restore(this.snapshot, options);
  };

  public capture = (): void => {
    this.snapshot = this.current;
  };

  public dispose = (): void => {
    this.cancelAnimation();
    this.listeners.clear();
  };

  private animate({
    duration = 0.28,
    ease = "power3.out",
    x = this.current.position.x,
    y = this.current.position.y,
    width = this.current.size.width,
    height = this.current.size.height,
    onComplete,
  }: AnimateOptions) {
    this.cancelAnimation();
    this.setAnimating(true);

    const proxy = {
      x: this.current.position.x,
      y: this.current.position.y,
      width: this.current.size.width,
      height: this.current.size.height,
    };

    this.tween = gsap.to(proxy, {
      x,
      y,
      width,
      height,
      duration,
      ease,
      onUpdate: () =>
        void this.setState(() => ({
          position: {
            x: proxy.x,
            y: proxy.y,
          },
          size: {
            height: proxy.height,
            width: proxy.width,
          },
        })),
      onComplete: () => {
        this.tween = null;
        this.setAnimating(false);
        onComplete?.();
      },
    });
  }

  private notify = (): void => {
    for (const listener of this.listeners) {
      listener();
    }
  };

  private setAnimating(next: boolean): void {
    if (this.isAnimating === next) return;

    this.isAnimating = next;
    this.notify();
  }
}
