import gsap, { SplitText } from "gsap/all";

abstract class HoverTextFXBase {
  protected element!: HTMLElement;
  protected $timeline: GSAPTimeline = gsap.timeline({
    defaults: {
      ease: "no",
    },
    paused: true,
  });

  constructor(element: unknown) {
    if (!element || !(element instanceof HTMLElement)) {
      throw new Error("Invalid element provided.");
    }
    this.element = element;
  }
}

export class HoverTextFX1 extends HoverTextFXBase {
  private text: string;
  private splitter!: SplitText;

  constructor(element: unknown) {
    super(element);
    this.text = this.element.textContent!;
    this.init();
  }

  public init() {
    this.element.innerHTML = "";
    this.element.ariaLabel = this.text;

    this.element.setAttribute("data-hover", this.text);
    this.element.classList.add(
      "grid",
      "w-fit",
      "overflow-y-hidden",
      "leading-normal",
    );

    const createNodeElement = (index: number) => {
      const node = document.createElement("div");
      node.innerHTML = this.text;
      node.ariaLabel = this.text;

      node.setAttribute("data-hover-item", String(index));
      node.classList.add("[grid-area:1/1]");

      return node;
    };

    for (let index = 0; index < 2; index++) {
      this.element.appendChild(createNodeElement(index));
    }

    this.splitText();
    this.fx();
  }

  private splitText() {
    const hoverItems = gsap.utils.selector(this.element)("[data-hover-item]");
    this.splitter = SplitText.create(hoverItems, {
      type: "chars",
    });
  }
  private fx() {
    const hoverItemOdd = gsap.utils.selector(
      "[data-hover-item]:nth-child(odd)",
    )("div");
    const hoverItemEven = gsap.utils.selector(
      "[data-hover-item]:nth-child(even)",
    )("div");

    const hoverTweenVars: GSAPTweenVars = {
      stagger: 0.015,
      duration: 0.65,
      ease: "power3.out",
    };

    this.$timeline
      .to(hoverItemOdd, {
        ...hoverTweenVars,
        yPercent: -100,
      })
      .fromTo(
        hoverItemEven,
        {
          yPercent: 100,
        },
        {
          ...hoverTweenVars,
          yPercent: 0,
        },
        "<",
      );
  }

  public revert() {
    this.splitter.revert();

    this.element.childNodes.forEach((node) => {
      this.element.removeChild(node);
    });

    this.element.innerHTML = this.text;
  }
  get timeline() {
    return this.$timeline;
  }
}
