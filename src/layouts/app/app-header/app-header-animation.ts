import gsap from "gsap";
export default class AppHeaderAnimation {
  #tl: GSAPTimeline;
  #pos = { start: 0, end: 0.5 };

  constructor(private scope: HTMLElement | null) {
    this.#tl = gsap.timeline({
      defaults: {
        ease: "sine.inOut",
      },
    });
    this.#initializeTl();
  }

  #initializeTl() {
    this.#tl.to(
      ".header--inner",
      {
        "--header-width": "20rem",
      },
      this.#pos.start,
    );

    this.#tl.to(
      ".header--button",
      {
        left: "calc(20rem - 1rem)",
        ease: "linear",
      },
      this.#pos.end,
    );

    this.#tl.to(
      this.scope,
      {
        height: `calc(50svh - calc(var(--header-top) * 2))`,
        duration: 1,
      },
      this.#pos.end,
    );

    this.#tl.fromTo(
      ".header--content",
      {
        autoAlpha: 0,
      },
      {
        autoAlpha: 1,
      },
      this.#pos.end,
    );
  }
  get timeline() {
    return this.#tl;
  }
}
