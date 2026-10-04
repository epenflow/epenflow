import { useEffect, useState, useSyncExternalStore } from "react";

import {
  BufferAttribute,
  BufferGeometry,
  Camera,
  CanvasTexture,
  ClampToEdgeWrapping,
  DataTexture,
  DataUtils,
  DoubleSide,
  HalfFloatType,
  LinearFilter,
  LinearMipMapLinearFilter,
  Mesh,
  RedFormat,
  Scene,
  ShaderMaterial,
  SRGBColorSpace,
  Vector2,
  Vector4,
  WebGLRenderer,
} from "three";
import { toCanvas } from "html-to-image";
import { isBrowser } from "es-toolkit";
import type { System } from "#/system/types.ts";
import {
  GENIE_CAPTURE_STYLE,
  GENIE_DEFAULTS,
  GENIE_EASE_LUT_SIZE,
  GENIE_EPSILON,
  GENIE_KICKOFF_ORIGIN,
  GENIE_MAX_ANISOTROPY,
  GENIE_MAX_STRIP,
  GENIE_PIXEL_RATIO,
  GENIE_TO_SIZE,
} from "#/system/constants.ts";
import { gsap } from "#/lib/gsap.ts";

const clamp = (value: number): number => (value > 0 ? (value < 1 ? value : 1) : 0);
const lerp = (from: number, to: number, progress: number): number => from + (to - from) * progress;

function sampleRow(fraction: number, curve: System.Genie.Curve, out: System.Genie.State): void {
  const { phase, progress, from, to } = curve;

  const delayFactor = phase === "minimized" ? 1 - fraction : fraction;

  const xDelay = delayFactor * curve.xDelay;
  const xT = curve.xEase(clamp((progress - xDelay) / Math.max(GENIE_EPSILON, 1 - xDelay)));

  const yDelay = delayFactor * curve.yDelay;
  const yT = curve.yEase(clamp((progress - yDelay) / Math.max(GENIE_EPSILON, 1 - yDelay)));

  const fromY = from.y + fraction * from.height;
  const toY = to.y + fraction * to.height;
  const fromLeft = from.x;
  const fromRight = from.x + from.width;
  const toLeft = to.x;
  const toRight = to.x + to.width;

  if (phase === "minimized") {
    out.left = lerp(fromLeft, toLeft, xT);
    out.right = lerp(fromRight, toRight, xT);
    out.destination = lerp(fromY, toY, yT);
  } else {
    out.left = lerp(toLeft, fromLeft, xT);
    out.right = lerp(toRight, fromRight, xT);
    out.destination = lerp(toY, fromY, yT);
  }
}

export function writeGenieVertices(
  position: Float32Array,
  rows: number,
  curve: System.Genie.Curve,
  scratch: System.Genie.State = { left: 0, right: 0, destination: 0 },
): void {
  for (let row = 0; row <= rows; row++) {
    sampleRow(row / rows, curve, scratch);
    const offset = row * 6;
    position[offset] = scratch.left;
    position[offset + 1] = scratch.destination;
    position[offset + 2] = 0;
    position[offset + 3] = scratch.right;
    position[offset + 4] = scratch.destination;
    position[offset + 5] = 0;
  }
}

function buildTopology(rows: number): [Float32Array<ArrayBuffer>, Uint16Array<ArrayBuffer>] {
  const uv = new Float32Array((rows + 1) * 4);
  for (let row = 0; row <= rows; row++) {
    const value = 1 - row / rows;
    uv[row * 4] = 0;
    uv[row * 4 + 1] = value;
    uv[row * 4 + 2] = 1;
    uv[row * 4 + 3] = value;
  }

  const index = new Uint16Array(rows * 6);
  for (let row = 0; row < rows; row++) {
    const topLeft = row * 2;
    const topRight = topLeft + 1;
    const bottomLeft = topLeft + 2;
    const bottomRight = topLeft + 3;
    const offset = row * 6;
    index[offset] = topLeft;
    index[offset + 1] = topRight;
    index[offset + 2] = bottomLeft;
    index[offset + 3] = topRight;
    index[offset + 4] = bottomRight;
    index[offset + 5] = bottomLeft;
  }

  return [uv, index] as const;
}

const VERTEX_SHADER = /* glsl */ `
  attribute float aRow;   // 0..1, tepi atas → bawah
  attribute float aSide;  // 0 = kiri, 1 = kanan
 
  uniform float uProgress;
  uniform float uOpen;      // 0 = minimize, 1 = open
  uniform vec4  uFrom;      // x, y, w, h (px viewport)
  uniform vec4  uTo;        // x, y, w, h (px viewport)
  uniform vec2  uDelay;     // x = delay sumbu X, y = delay sumbu Y
  uniform vec2  uViewport;  // px
  uniform float uShade;     // 0..1, kegelapan maksimum saat terjepit
  uniform sampler2D uEaseX;
  uniform sampler2D uEaseY;
 
  varying vec2  vUv;
  varying float vShade;
 
  const float LUT = ${GENIE_EASE_LUT_SIZE}.0;
 
  float easeLookup(sampler2D lut, float t) {
    // Pusat texel: t=0 → 0.5/LUT, t=1 → (LUT-0.5)/LUT
    return texture2D(lut, vec2(t * (LUT - 1.0) / LUT + 0.5 / LUT, 0.5)).r;
  }
 
  float stripT(sampler2D lut, float delayFactor, float delay) {
    float d = delayFactor * delay;
    float t = clamp((uProgress - d) / max(1e-6, 1.0 - d), 0.0, 1.0);
    return easeLookup(lut, t);
  }
 
  void main() {
    float f  = aRow;
    float df = mix(1.0 - f, f, uOpen);
 
    float xT = stripT(uEaseX, df, uDelay.x);
    float yT = stripT(uEaseY, df, uDelay.y);
 
    vec4 from = mix(uFrom, uTo, uOpen);
    vec4 to   = mix(uTo, uFrom, uOpen);
 
    float x0 = from.x + aSide * from.z;
    float x1 = to.x   + aSide * to.z;
    float y0 = from.y + f * from.w;
    float y1 = to.y   + f * to.w;
 
    vec2 p = vec2(mix(x0, x1, xT), mix(y0, y1, yT));
 
    // Shading ringan: makin sempit baris, makin gelap.
    float widthNow = mix(from.z, to.z, xT);
    float ratio = clamp(widthNow / max(1.0, uFrom.z), 0.0, 1.0);
    vShade = mix(1.0 - uShade, 1.0, ratio);
 
    vUv = vec2(aSide, 1.0 - f);
 
    // Piksel viewport (Y ke bawah) → clip space.
    gl_Position = vec4(
      p.x / uViewport.x * 2.0 - 1.0,
      1.0 - p.y / uViewport.y * 2.0,
      0.0,
      1.0
    );
  }
`;

const FRAGMENT_SHADER = /* glsl */ `
  uniform sampler2D uMap;
 
  varying vec2  vUv;
  varying float vShade;
 
  void main() {
    vec4 c = texture2D(uMap, vUv);
    c.rgb *= vShade;
    gl_FragColor = c;
    #include <colorspace_fragment>
  }
`;

function createEaseLut(ease: System.Genie.EaseFn, size = GENIE_EASE_LUT_SIZE): DataTexture {
  const data = new Uint16Array(size);

  for (let index = 0; index < size; index++) {
    data[index] = DataUtils.toHalfFloat(ease(index / (size - 1)));
  }

  const texture = new DataTexture(data, size, 1, RedFormat, HalfFloatType);
  texture.minFilter = LinearFilter;
  texture.magFilter = LinearFilter;
  texture.wrapS = ClampToEdgeWrapping;
  texture.wrapT = ClampToEdgeWrapping;
  texture.generateMipmaps = false;
  texture.needsUpdate = true;

  return texture;
}

const windowViewport: System.Genie.Viewport = {
  getSnapshot: () => ({
    height: isBrowser() ? window.innerHeight : 0,
    width: isBrowser() ? window.innerWidth : 0,
  }),
};

function normalizeDPR(dpr?: number): number {
  const [min, max] = GENIE_PIXEL_RATIO;

  if (!isBrowser()) return min;
  const detected = dpr ?? (window.devicePixelRatio || 1);

  return gsap.utils.clamp(min, max, detected);
}

export class Genie {
  private canvas: HTMLCanvasElement | null = null;

  private snapshot: HTMLCanvasElement | null = null;
  private promise: Promise<HTMLCanvasElement> | null = null;

  private gl: System.Genie.GLContext | null = null;
  private texture: CanvasTexture | null = null;
  private geometry: BufferGeometry | null = null;
  private rows: number = 0;

  private tween: gsap.core.Tween | null = null;
  private isAnimating: boolean = false;

  private readonly config: System.Genie.Config;
  private readonly hooks: System.Genie.LifecycleHooks;
  private readonly viewport: System.Genie.Viewport;

  private readonly xAxisEaseFn: gsap.EaseFunction;
  private readonly yAxisEaseFn: gsap.EaseFunction;
  private readonly kickoffEaseFn: gsap.EaseFunction;

  private readonly listeners: Set<VoidFunction> = new Set<VoidFunction>();

  constructor(options: System.Genie.Options = {}) {
    this.viewport = options.viewport ?? windowViewport;

    this.hooks = {
      onBefore: options.onBefore,
      onAfter: options.onAfter,
      onError: options.onError,
    };

    this.config = {
      duration: options.duration ?? GENIE_DEFAULTS.duration,
      strip: Math.max(
        1,
        Math.min(Math.round(options.strip ?? GENIE_DEFAULTS.strip), GENIE_MAX_STRIP),
      ),
      kickoffDuration: options.kickoffDuration ?? GENIE_DEFAULTS.kickoffDuration,
      xProgressDelay: gsap.utils.clamp(
        0,
        1,
        options.xProgressDelay ?? GENIE_DEFAULTS.xProgressDelay,
      ),
      yProgressDelay: gsap.utils.clamp(
        0,
        1,
        options.yProgressDelay ?? GENIE_DEFAULTS.yProgressDelay,
      ),
      xAxisEasing: options.xAxisEasing ?? GENIE_DEFAULTS.xAxisEasing,
      yAxisEasing: options.yAxisEasing ?? GENIE_DEFAULTS.yAxisEasing,
      kickoffEasing: options.kickoffEasing ?? GENIE_DEFAULTS.kickoffEasing,
      kickoffScale: options.kickoffScale ?? GENIE_DEFAULTS.kickoffScale,
      kickoffOpacity: options.kickoffOpacity ?? GENIE_DEFAULTS.kickoffOpacity,
      pixelRatio: normalizeDPR(options.pixelRatio),
      enableTextureCache: options.enableTextureCache ?? GENIE_DEFAULTS.enableTextureCache,
      enableErrorLogging: options.enableErrorLogging ?? GENIE_DEFAULTS.enableErrorLogging,
      toSize: options.toSize ?? GENIE_TO_SIZE,
      mipmaps: options.mipmaps ?? GENIE_DEFAULTS.mipmaps,
      antialias: options.antialias ?? GENIE_DEFAULTS.antialias,
      captureStyle: { ...GENIE_CAPTURE_STYLE, ...options.captureStyle },
      pinchShading: gsap.utils.clamp(0, 1, options.pinchShading ?? GENIE_DEFAULTS.pinchShading),
    };

    this.xAxisEaseFn = gsap.parseEase(this.config.xAxisEasing);
    this.yAxisEaseFn = gsap.parseEase(this.config.yAxisEasing);
    this.kickoffEaseFn = gsap.parseEase(this.config.kickoffEasing);
  }

  /**
   *
   * @param {HTMLCanvasElement|null} canvas
   * @returns {void}
   */
  public attach = (canvas: HTMLCanvasElement | null): void => {
    if (canvas === this.canvas) return;
    this.cancel();
    this.releaseGL();

    this.canvas = canvas;
  };

  /**
   * @template {HTMLElement} F
   * @template {HTMLElement} T
   * @param {F} from
   * @param {T} to
   * @param {VoidFunction} onComplete
   * @returns {void}
   */
  public minimize = <F extends HTMLElement = HTMLElement, T extends HTMLElement = HTMLElement>(
    from: F,
    to: T,
    onComplete?: VoidFunction,
  ): void => {
    if (this.isAnimating || !this.canvas || !isBrowser()) {
      onComplete?.();
      return;
    }

    this.hooks.onBefore?.("minimized");
    this.setAnimatingState(true);

    const pending = this.promise;
    const capture = pending ?? this.capture(from);

    if (!pending) {
      gsap.to(from, {
        scale: this.config.kickoffScale,
        opacity: this.config.kickoffOpacity,
        duration: this.config.kickoffDuration,
        ease: this.kickoffEaseFn,
        transformOrigin: GENIE_KICKOFF_ORIGIN,
      });
    }

    const hide = () => {
      gsap.killTweensOf(from);
      gsap.set(from, {
        clearProps: "scale,transformOrigin",
        opacity: 0,
        pointerEvents: "none",
      });
    };

    capture.then(
      (canvas) => {
        this.setSnapshot(canvas);
        hide();

        this.play("minimized", from, to, () => {
          this.setAnimatingState(false);
          this.hooks.onAfter?.("minimized");
          onComplete?.();
        });
      },
      (error) => {
        this.reportError(error, "minimized");
        hide();
        this.setAnimatingState(false);
        onComplete?.();
      },
    );
  };

  public restore = <F extends HTMLElement = HTMLElement, T extends HTMLElement = HTMLElement>(
    from: F,
    to: T,
    onComplete?: VoidFunction,
  ): void => {
    if (this.isAnimating) {
      onComplete?.();
      return;
    }

    if (!this.snapshot || !this.canvas || !isBrowser()) {
      this.revealFrom(from);
      onComplete?.();
      return;
    }

    this.hooks.onBefore?.("open");
    this.setAnimatingState(true);

    this.play("open", from, to, () => {
      this.revealFrom(from);
      this.setAnimatingState(false);
      this.hooks.onAfter?.("open");
      onComplete?.();
    });
  };

  /**
   * @returns {void}
   */
  public pause = (): void => {
    this.tween?.pause();
  };

  /**
   * @returns {void}
   */
  public resume = (): void => {
    this.tween?.resume();
  };

  /**
   * @returns {void}
   */
  public cancel = (): void => {
    this.tween?.kill();
    this.tween = null;
    this.clearOutput();
    this.setAnimatingState(false);
  };

  /**
   * @returns {void}
   */
  public dispose = (): void => {
    this.cancel();
    this.releaseGL();
    this.canvas = null;

    if (!this.config.enableTextureCache) {
      this.snapshot = null;
    }
  };

  /**
   *
   * @param {VoidFunction} callback
   * @returns {VoidFunction}
   */
  public subscribe = (callback: VoidFunction): VoidFunction => {
    this.listeners.add(callback);

    return () => {
      this.listeners.delete(callback);
    };
  };

  /**
   *
   * @returns {boolean}
   */
  public getSnapshot = (): boolean => this.isAnimating;
  /**
   *
   * @returns {boolean}
   */
  public getServerSnapshot = (): boolean => false;

  /**
   *
   * @returns {System.Window.Rect}
   */
  public getToRect = (): System.Window.Rect => {
    const viewport = this.viewport.getSnapshot();
    const { toSize } = this.config;

    return {
      x: viewport.width / 2 - toSize.width / 2,
      y: viewport.height - toSize.height,
      width: toSize.width,
      height: toSize.height,
    };
  };

  /**
   *
   * @param {HTMLElement} from
   * @returns {void}
   */
  public prime = (from: HTMLElement): void => {
    if (this.isAnimating || this.promise || !isBrowser()) return;

    const promise = this.capture(from).then((canvas) => {
      if (!this.isAnimating) this.setSnapshot(canvas);
      return canvas;
    });
    this.promise = promise;

    const release = () => {
      if (this.promise === promise) this.promise = null;
    };

    promise.then(
      () => {
        release();
        this.warmUp();
      },
      (error) => {
        release();
        this.reportError(error, "minimized");
      },
    );
  };

  /**
   *
   * @param {System.Genie.Phase} phase
   * @param {HTMLElement} from
   * @param {HTMLElement} to
   * @param {VoidFunction} done
   */
  private play(
    phase: System.Genie.Phase,
    from: HTMLElement,
    to: HTMLElement,
    done: VoidFunction,
  ): void {
    this.tween?.kill();

    try {
      const fromRect = from.getBoundingClientRect();
      const toRect = to.getBoundingClientRect();

      const gl = this.ensureGl();
      if (!gl || !this.snapshot) {
        throw new Error("The WebGL renderer is not available (is the canvas not attached yet?)");
      }
      const texture = this.ensureTexture(gl);
      gl.mesh.geometry = this.ensureGeometry(this.config.strip);

      const uniforms = gl.uniforms;
      uniforms.uMap.value = texture;
      uniforms.uOpen.value = phase === "open" ? 1 : 0;
      uniforms.uFrom.value.set(fromRect.x, fromRect.y, fromRect.width, fromRect.height);
      uniforms.uTo.value.set(toRect.x, toRect.y, toRect.width, toRect.height);

      const drawFrame = (progress: number) => {
        this.syncSize(gl);
        uniforms.uProgress.value = progress;
        gl.renderer.render(gl.scene, gl.camera);
      };

      this.syncSize(gl);
      gl.mesh.visible = true;
      drawFrame(0);

      const progress = { value: 0 };
      this.tween = gsap.to(progress, {
        value: 1,
        duration: this.config.duration / 1000,
        ease: "none",
        onUpdate: () => drawFrame(progress.value),
        onComplete: () => {
          this.clearOutput();
          this.tween = null;
          done();
        },
        onInterrupt: () => {
          this.tween = null;
        },
      });
    } catch (error) {
      this.reportError(error, phase);
      this.clearOutput();
      done();
    }
  }

  /**
   *
   * @param {HTMLElement} from
   * @returns {Promise<HTMLCanvasElement>}
   */
  private capture(from: HTMLElement): Promise<HTMLCanvasElement> {
    return toCanvas(from, {
      pixelRatio: this.config.pixelRatio,
      cacheBust: false,
      style: this.config.captureStyle,
    });
  }

  /**
   *
   * @param {HTMLCanvasElement} canvas
   * @returns {void}
   */
  private setSnapshot(canvas: HTMLCanvasElement): void {
    if (this.snapshot === canvas) return;
    this.disposeTexture();
    this.snapshot = canvas;
  }

  /**
   * @template {HTMLElement} T
   * @param {T} from
   * @returns {void}
   */
  private revealFrom<T extends HTMLElement = HTMLElement>(from: T): void {
    from.style.opacity = "";
    from.style.pointerEvents = "";
  }

  /**
   *
   * @returns {void}
   */
  private warmUp(): void {
    if (this.isAnimating || !this.canvas || !this.snapshot) return;

    try {
      const gl = this.ensureGl();
      if (!gl) return;

      const texture = this.ensureTexture(gl);
      gl.uniforms.uMap.value = texture;
      gl.mesh.geometry = this.ensureGeometry(this.config.strip);

      gl.renderer.initTexture(texture);
      gl.mesh.visible = true;
      gl.renderer.compile(gl.scene, gl.camera);
      gl.mesh.visible = false;
    } catch {}
  }

  /**
   *
   * @param {number} rows
   * @returns {BufferGeometry}
   */
  private ensureGeometry(rows: number): BufferGeometry {
    if (this.geometry && this.rows === rows) return this.geometry;

    this.geometry?.dispose();

    const [_, index] = buildTopology(rows);
    const count = (rows + 1) * 2;
    const aRow = new Float32Array(count);
    const aSide = new Float32Array(count);

    for (let r = 0; r <= rows; r++) {
      const fraction = r / rows;
      aRow[r * 2] = fraction;
      aRow[r * 2 + 1] = fraction;
      aSide[r * 2] = 0;
      aSide[r * 2 + 1] = 1;
    }

    const geometry = new BufferGeometry();
    geometry.setAttribute("position", new BufferAttribute(new Float32Array(count * 3), 3));
    geometry.setAttribute("aRow", new BufferAttribute(aRow, 1));
    geometry.setAttribute("aSide", new BufferAttribute(aSide, 1));
    geometry.setIndex(new BufferAttribute(index, 1));

    this.geometry = geometry;
    this.rows = rows;

    return geometry;
  }

  /**
   *
   * @returns {System.Genie.GLContext|null}
   */
  private ensureGl(): System.Genie.GLContext | null {
    if (this.gl) return this.gl;
    if (!this.canvas) return null;

    const renderer = new WebGLRenderer({
      canvas: this.canvas,
      alpha: true,
      antialias: this.config.antialias,
      premultipliedAlpha: true,
    });
    renderer.setPixelRatio(this.config.pixelRatio);
    renderer.setClearColor(0x000000, 0);

    const scene = new Scene();
    const camera = new Camera();

    const easeX = createEaseLut(this.xAxisEaseFn);
    const easeY = createEaseLut(this.yAxisEaseFn);

    const uniforms: System.Genie.Uniform = {
      uMap: { value: null },
      uEaseX: { value: easeX },
      uEaseY: { value: easeY },
      uProgress: { value: 0 },
      uOpen: { value: 0 },
      uFrom: { value: new Vector4() },
      uTo: { value: new Vector4() },
      uDelay: { value: new Vector2(this.config.xProgressDelay, this.config.yProgressDelay) },
      uViewport: { value: new Vector2() },
      uShade: { value: this.config.pinchShading },
    };

    const material = new ShaderMaterial({
      vertexShader: VERTEX_SHADER,
      fragmentShader: FRAGMENT_SHADER,
      uniforms: uniforms,
      transparent: true,
      side: DoubleSide,
      depthTest: false,
      depthWrite: false,
    });

    const mesh = new Mesh(new BufferGeometry(), material);
    mesh.frustumCulled = false;
    mesh.visible = false;
    scene.add(mesh);

    const onContextLost = (event: Event) => event.preventDefault();
    this.canvas.addEventListener("webglcontextlost", onContextLost);

    this.gl = {
      renderer,
      scene,
      camera,
      material,
      uniforms,
      mesh,
      easeX,
      easeY,
      size: { width: 0, height: 0 },
      onContextLost,
    };

    this.syncSize(this.gl);
    return this.gl;
  }

  /**
   *
   * @param {System.Genie.GLContext} gl
   * @returns {void}
   */
  private syncSize(gl: System.Genie.GLContext): void {
    const { width, height } = this.viewport.getSnapshot();
    if (width === gl.size.width && height === gl.size.height) return;

    gl.size = { width, height };
    gl.renderer.setSize(width, height, true);
    gl.uniforms.uViewport.value.set(Math.max(1, width), Math.max(1, height));
  }

  /**
   *
   * @param {System.Genie.GLContext} gl
   * @returns {CanvasTexture}
   */
  private ensureTexture(gl: System.Genie.GLContext): CanvasTexture {
    if (this.texture) return this.texture;
    if (!this.snapshot) throw new Error(`[${Genie.name}]: snapshot DOM not available`);

    const texture = new CanvasTexture(this.snapshot);
    texture.colorSpace = SRGBColorSpace;
    texture.magFilter = LinearFilter;
    texture.generateMipmaps = this.config.mipmaps;
    texture.minFilter = this.config.mipmaps ? LinearMipMapLinearFilter : LinearFilter;
    texture.anisotropy = Math.min(
      GENIE_MAX_ANISOTROPY,
      gl.renderer.capabilities.getMaxAnisotropy(),
    );

    this.texture = texture;
    return texture;
  }

  /**
   *
   * @returns {void}
   */
  private disposeTexture(): void {
    this.texture?.dispose();
    this.texture = null;
  }

  /**
   *
   * @returns {void}
   */
  private releaseGL(): void {
    this.disposeTexture();
    this.geometry?.dispose();
    this.geometry = null;
    this.rows = 0;

    const gl = this.gl;
    if (!gl) return;

    this.canvas?.removeEventListener("webglcontextlost", gl.onContextLost);
    gl.easeX.dispose();
    gl.easeY.dispose();
    gl.material.dispose();
    gl.renderer.dispose();
    this.gl = null;
  }

  private reportError(error: unknown, phase: System.Genie.Phase): void {
    const message = error instanceof Error ? error.message : String(error);
    const wrapped = new Error(
      `Genie ${phase === "open" ? "restore" : "minimized"} failed: ${message}`,
      { cause: error },
    );

    if (this.config.enableErrorLogging) console.warn(wrapped);
    this.hooks.onError?.(wrapped, phase);
  }

  /**
   *
   * @param {boolean} state
   * @returns {void}
   */
  private setAnimatingState(state: boolean): void {
    if (this.isAnimating === state) return;
    this.isAnimating = state;

    for (const listener of this.listeners) listener();
  }

  private clearOutput(): void {
    if (!this.gl) return;
    this.gl.mesh.visible = false;
    this.gl.renderer.clear();
  }
}

export function useGenie(options: System.Genie.Options = {}) {
  const [genie] = useState(() => new Genie(options));

  const isAnimating = useSyncExternalStore(
    genie.subscribe,
    genie.getSnapshot,
    genie.getServerSnapshot,
  );

  useEffect(() => () => genie.dispose(), [genie]);

  return [genie, isAnimating] as const;
}
