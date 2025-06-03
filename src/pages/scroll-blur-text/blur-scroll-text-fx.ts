import gsap, { SplitText } from "gsap/all";

type BlurScrollFXTweenProps = {
  from: gsap.TweenVars;
  to: gsap.TweenVars;
};
abstract class BlurScrollTextFXBase {
  protected element!: HTMLElement;
  protected splitter!: globalThis.SplitText;
  protected scrollTriggerVars?: ScrollTrigger.Vars;
  protected abstract tweenProps(): BlurScrollFXTweenProps;
  protected scrollTriggerProps(): ScrollTrigger.Vars {
    return {
      trigger: this.element,
      start: "top bottom-=15%",
      end: "bottom center+=15%",
      scrub: true,
      ...this.scrollTriggerVars,
    };
  }

  constructor(element?: unknown, scrollTriggerVars?: ScrollTrigger.Vars) {
    if (!element || !(element instanceof HTMLElement)) {
      throw new Error("Invalid text element provided.");
    }

    this.element = element;
    this.scrollTriggerVars = scrollTriggerVars;

    this.#initFX();
    this.#scrollFX();
  }

  #initFX() {
    this.splitter = SplitText.create(this.element, {
      type: "words, chars",
    });
  }

  #scrollFX() {
    gsap.fromTo(this.splitter.chars, this.tweenProps().from, {
      stagger: 0.05,
      ...this.tweenProps().to,
    });
  }
}
export class BlurScrollTextFX1 extends BlurScrollTextFXBase {
  protected tweenProps(): BlurScrollFXTweenProps {
    return {
      from: {
        filter: "blur(10px) brightness(0%)",
        willChange: "filter",
      },
      to: {
        ease: "none",
        filter: "blur(0px) brightness(100%)",
        scrollTrigger: this.scrollTriggerProps(),
      },
    };
  }
}

export class BlurScrollTextFX2 extends BlurScrollTextFXBase {
  protected tweenProps(): BlurScrollFXTweenProps {
    return {
      from: { filter: "blur(10px) brightness(30%)", willChange: "filter" },
      to: {
        ease: "none",
        filter: "blur(0px) brightness(100%)",
        scrollTrigger: this.scrollTriggerProps(),
      },
    };
  }
}
export class BlurScrollTextFX3 extends BlurScrollTextFXBase {
  protected tweenProps(): BlurScrollFXTweenProps {
    return {
      from: {
        scaleY: 0.1,
        scaleX: 1.8,
        filter: "blur(10px) brightness(50%)",
        willChange: "filter, transform",
      },
      to: {
        ease: "none",
        scaleY: 1,
        scaleX: 1,
        filter: "blur(0px) brightness(100%)",
        scrollTrigger: this.scrollTriggerProps(),
      },
    };
  }
}

export class BlurScrollTextFX4 extends BlurScrollTextFXBase {
  protected tweenProps(): BlurScrollFXTweenProps {
    return {
      from: {
        opacity: 0,
        skewX: -20,
        filter: "blur(8px)",
        willChange: "filter, transform",
      },
      to: {
        ease: "sine",
        opacity: 1,
        skewX: 0,
        filter: "blur(0px)",
        stagger: 0.04,
        scrollTrigger: this.scrollTriggerProps(),
      },
    };
  }
}
