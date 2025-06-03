import gsap from "gsap/all";

export default class AppHeaderFX {
  private element: HTMLElement;
  private $timeline: gsap.core.Timeline = gsap.timeline({
    id: "App Header FX",
    defaults: {
      ease: "sine.inOut",
    },
    paused: true,
  });
  private fxPosition = {
    start: 0,
    end: "<0.25",
  };
  private selectors = {
    headerInner: ".header--inner",
    headerButton: ".header--button",
    headerContent: ".header--content",
  };

  constructor(element?: HTMLElement | null) {
    if (!element || !(element instanceof HTMLElement)) {
      throw new Error("Invalid element provided.");
    }

    this.element = element;

    this.#initFX();
  }

  #initFX(): void {
    const scopeSelectors = gsap.utils.selector(this.element);
    const { headerInner, headerButton, headerContent } = this.selectors;
    const { start: startFX, end: endFX } = this.fxPosition;

    gsap.set(scopeSelectors(headerContent), {
      autoAlpha: 0,
    });

    this.$timeline
      .to(
        scopeSelectors(headerInner),
        {
          "--header-width": "20rem",
        },
        startFX,
      )
      .to(
        scopeSelectors(headerButton),
        {
          left: `calc(20rem - 1rem)`,
          ease: "none",
        },
        endFX,
      )
      .to(
        this.element,
        {
          height: `calc(50svh - calc(var(--header-top) * 2))`,
          duration: 1,
        },
        endFX,
      )
      .to(
        scopeSelectors(headerContent),
        {
          autoAlpha: 1,
        },
        endFX,
      );
  }
  get timeline(): gsap.core.Timeline {
    return this.$timeline;
  }

  play(): void {
    this.$timeline.play();
  }

  reverse(): void {
    this.$timeline.reverse();
  }

  toggle(): void {
    if (this.$timeline.reversed()) {
      this.$timeline.play();
    } else {
      this.$timeline.reverse();
    }
  }
}
