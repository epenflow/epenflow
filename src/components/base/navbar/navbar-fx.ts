import gsap, { SplitText } from "gsap/all";

export default class NavbarFX {
  #element: HTMLElement;
  #state!: boolean;
  #splitter!: SplitText;

  #tl: GSAPTimeline = gsap.timeline({
    id: "navbar__fx",
    paused: true,
    defaults: {
      ease: "none",
      delay: 0,
    },
  });

  constructor(element?: unknown) {
    if (!element || !(element instanceof HTMLElement)) {
      throw new Error("Invalid element provided.");
    }
    this.#element = element;

    this.#setup();
  }

  #setup(): void {
    this.#splitter = SplitText.create(".header__heading", {
      type: "chars",
      charsClass: "header__heading-char",
    });

    this.#tl
      .to(this.#selector(".header__toggle-wrap"), {
        width: "var(--max-width)",
        ease: "power4",
      })
      .to(
        this.#splitter.chars,
        {
          autoAlpha: 1,
          transform: "scaleX(1) translateX(0%)",
          stagger: 0.05,
          ease: "sine",
          duration: 0.5,
        },
        "<0.5",
      )
      .to(
        this.#selector(".header__toggle"),
        {
          left: "var(--max-x)",
          ease: "sine",
          duration: 0.5,
        },
        "<",
      )
      .to(
        this.#selector(".header__toggle-outer"),
        {
          background: "var(--color-green-600)",
        },
        "<",
      )
      .to(
        this.#element,
        {
          height: "var(--max-height)",
          duration: 0.5,
          ease: "sine.inOut",
        },
        "<",
      )
      .to(
        ".header__content-wrap",
        {
          autoAlpha: 1,
          display: "inherit",
          ease: "sine.inOut",
        },
        "<",
      );
  }

  #selector(target: string) {
    return gsap.utils.selector(this.#element)(target);
  }

  public toggle(): void {
    if (!this.#state) {
      this.#state = !this.#state;
      this.#tl.play();
    } else {
      this.#state = !this.#state;
      this.#tl.reverse();
    }
  }
  public revert() {
    this.#tl.revert();
    this.#splitter.revert();
  }

  get timeline(): GSAPTimeline {
    return this.#tl;
  }
}
