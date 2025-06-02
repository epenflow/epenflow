import { useGSAP } from "@gsap/react";
import gsap from "gsap/all";
import React from "react";
import For from "~/components/utility/for";

const Page = () => {
  const scope = React.useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const ball: HTMLDivElement[] = gsap.utils.toArray("[data-ball]");
      const stage = scope.current?.querySelector(
        "[data-ball-stage]",
      ) as HTMLElement;

      const anim = new BallAnimation({
        ball,
        stage,
      });
      anim.render();
    },
    { scope },
  );

  return (
    <main ref={scope} className="h-dvh w-full overflow-clip">
      <section data-ball-stage className="w-full h-full origin-center">
        <For
          each={[1, 2, 3, 4]}
          children={(i) => (
            <div
              key={i}
              data-ball={i}
              className="absolute top-0 left-0 mix-blend-difference rounded-full origin-center"
            />
          )}
        />
      </section>
    </main>
  );
};
export default Page;

class BallAnimation {
  #BALL_SETTINGS = {
    x: 0,
    y: 0,
    size: 100,
    r: Math.random() * 255,
    g: Math.random() * 255,
    b: Math.random() * 255,
  };
  #STAGE_SETTINGS = {
    rotate: 1000,
  };
  #ANIM_SETTINGS = {
    interval: 250,
    duration: 2,
    yoyo: true,
    repeat: -1,
  };

  constructor(
    private el: {
      ball?: HTMLDivElement[] | null;
      stage: HTMLElement;
    },
  ) {}

  #style() {
    this.#BALL_SETTINGS.x =
      window.innerWidth * 0.5 - this.#BALL_SETTINGS.size * 0.5;
    this.#BALL_SETTINGS.y =
      window.innerHeight * 0.5 - this.#BALL_SETTINGS.size * 0.5;

    if (!this.el.ball) return;

    for (let i = 0; i < this.el.ball.length; i++) {
      this.el.ball[i].style.left = `${this.#BALL_SETTINGS.x}px`;
      this.el.ball[i].style.top = `${this.#BALL_SETTINGS.y}px`;
      this.el.ball[i].style.width = `${this.#BALL_SETTINGS.size}px`;
      this.el.ball[i].style.height = `${this.#BALL_SETTINGS.size}px`;
      this.el.ball[i].style.background =
        `rgb(${this.#BALL_SETTINGS.r},${this.#BALL_SETTINGS.g},${this.#BALL_SETTINGS.b})`;
    }
  }

  #time(delay: number, center: number) {
    const radius = 100 / 2;
    const time = new Date().getTime() / delay;
    const x = (center + Math.cos(time) * radius) / 2;
    const y = (center + Math.sin(time) * radius) / 2;
    return [x, y];
  }

  #ballMove() {
    const [x01, y01] = this.#time(
      this.#ANIM_SETTINGS.interval,
      this.#ANIM_SETTINGS.interval,
    );
    const [x02, y02] = this.#time(
      -this.#ANIM_SETTINGS.interval,
      -this.#ANIM_SETTINGS.interval,
    );
    const cord: { x: number; y: number }[] = [
      { x: x01, y: y01 },
      { x: x02, y: y02 },
      { x: x01, y: y02 },
      { x: x02, y: y01 },
    ];

    if (!this.el.ball) return;

    gsap.to(this.el.ball, {
      x: (i) => cord[i].x,
      y: (i) => cord[i].y,
      duration: this.#ANIM_SETTINGS.duration,
      repeat: this.#ANIM_SETTINGS.repeat,
      yoyo: this.#ANIM_SETTINGS.yoyo,
    });
  }
  #stageMove() {
    if (!this.el.stage) return;
    gsap.to(this.el.stage, {
      rotate: this.#STAGE_SETTINGS.rotate,
      duration: 20,
      repeat: this.#ANIM_SETTINGS.repeat,
      yoyo: this.#ANIM_SETTINGS.yoyo,
    });
  }

  render() {
    this.#style();
    this.#ballMove();
    this.#stageMove();
    window.addEventListener("resize", () => {
      this.#style();
    });
  }
}
