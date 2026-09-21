import { useEffect, useState, useSyncExternalStore } from "react";

import {
  BufferAttribute,
  BufferGeometry,
  CanvasTexture,
  DoubleSide,
  DynamicDrawUsage,
  LinearFilter,
  LinearMipmapLinearFilter,
  Mesh,
  MeshBasicMaterial,
  OrthographicCamera,
  Scene,
  SRGBColorSpace,
  WebGLRenderer,
} from "three";
import { toCanvas } from "html-to-image";
import { gsap } from "gsap";
/**
 * Matematika deformasi Genie — murni, tanpa DOM / three / gsap.
 *
 * Ini adalah port 1:1 dari `calculateStripAnimationState` pada WindowGenie
 * versi Canvas 2D, dengan dua perubahan yang disengaja:
 *   1. Tidak ada alokasi per-panggilan (tidak memakai gsap.utils.clamp/interpolate
 *      yang membuat closure baru setiap dipanggil).
 *   2. Pembagi `1 - delay` dijaga agar tidak nol (delay = 1 sebelumnya → NaN).
 *
 * Koordinat: piksel viewport, sumbu Y ke bawah (sama dengan DOM).
 */

export type GeniePhase = "open" | "minimize";

export interface Point {
  x: number;
  y: number;
}

export interface Size {
  width: number;
  height: number;
}

export type Rect = Point & Size;

export type EaseFn = (t: number) => number;

/** Semua yang dibutuhkan untuk menghitung satu frame. */
export interface GenieCurve {
  phase: GeniePhase;
  /** 0..1, progres global animasi (linear; easing diterapkan per-strip). */
  progress: number;
  /** Rect window (posisi terakhir di layar). */
  element: Rect;
  /** Rect dock / anchor. */
  dock: Rect;
  xDelay: number;
  yDelay: number;
  xEase: EaseFn;
  yEase: EaseFn;
}

export interface RowState {
  left: number;
  right: number;
  /** Posisi Y (piksel viewport) baris ini. */
  destination: number;
}

const EPSILON = 1e-6;

/** clamp ke [0, 1]; NaN → 0 (agar tidak merambat ke vertex). */
const clamp01 = (value: number): number => (value > 0 ? (value < 1 ? value : 1) : 0);

const lerp = (from: number, to: number, t: number): number => from + (to - from) * t;

/**
 * Hitung kiri / kanan / Y untuk satu baris pada pecahan tinggi `fraction`
 * (0 = tepi atas window, 1 = tepi bawah). Hasil ditulis ke `out`.
 */
export function sampleGenieRow(fraction: number, curve: GenieCurve, out: RowState): void {
  const { phase, progress, element, dock } = curve;

  // Fase minimize: strip paling bawah bergerak duluan. Fase open: kebalikannya.
  const delayFactor = phase === "minimize" ? 1 - fraction : fraction;

  const xDelay = delayFactor * curve.xDelay;
  const xT = curve.xEase(clamp01((progress - xDelay) / Math.max(EPSILON, 1 - xDelay)));

  const yDelay = delayFactor * curve.yDelay;
  const yT = curve.yEase(clamp01((progress - yDelay) / Math.max(EPSILON, 1 - yDelay)));

  const elementY = element.y + fraction * element.height;
  const dockY = dock.y + fraction * dock.height;
  const elementLeft = element.x;
  const elementRight = element.x + element.width;
  const dockLeft = dock.x;
  const dockRight = dock.x + dock.width;

  if (phase === "minimize") {
    out.left = lerp(elementLeft, dockLeft, xT);
    out.right = lerp(elementRight, dockRight, xT);
    out.destination = lerp(elementY, dockY, yT);
  } else {
    out.left = lerp(dockLeft, elementLeft, xT);
    out.right = lerp(dockRight, elementRight, xT);
    out.destination = lerp(dockY, elementY, yT);
  }
}

/**
 * Isi buffer posisi mesh: (rows + 1) baris × 2 vertex (kiri, kanan) × 3 float.
 * Panjang buffer harus (rows + 1) * 6.
 */
export function writeGenieVertices(
  positions: Float32Array,
  rows: number,
  curve: GenieCurve,
  scratch: RowState = { left: 0, right: 0, destination: 0 },
): void {
  for (let row = 0; row <= rows; row++) {
    sampleGenieRow(row / rows, curve, scratch);
    const offset = row * 6;
    positions[offset] = scratch.left;
    positions[offset + 1] = scratch.destination;
    positions[offset + 2] = 0;
    positions[offset + 3] = scratch.right;
    positions[offset + 4] = scratch.destination;
    positions[offset + 5] = 0;
  }
}

/** UV + index statis untuk mesh strip. Vertex baris i: kiri = 2i, kanan = 2i + 1. */
export function buildGenieTopology(rows: number): { uv: Float32Array; index: Uint16Array } {
  const uv = new Float32Array((rows + 1) * 4);
  for (let row = 0; row <= rows; row++) {
    const v = 1 - row / rows; // CanvasTexture: flipY = true → v = 1 adalah tepi atas gambar
    uv[row * 4] = 0;
    uv[row * 4 + 1] = v;
    uv[row * 4 + 2] = 1;
    uv[row * 4 + 3] = v;
  }

  const index = new Uint16Array(rows * 6);
  for (let row = 0; row < rows; row++) {
    const a = row * 2; // kiri atas
    const b = a + 1; // kanan atas
    const c = a + 2; // kiri bawah
    const d = a + 3; // kanan bawah
    const o = row * 6;
    index[o] = a;
    index[o + 1] = b;
    index[o + 2] = c;
    index[o + 3] = b;
    index[o + 4] = d;
    index[o + 5] = c;
  }

  return { uv, index };
}

// ---------------------------------------------------------------------------
// Konstanta (nilai default sama dengan versi Canvas 2D)
// ---------------------------------------------------------------------------

const ANIMATION_DEFAULTS = {
  duration: 420, // ms
  stripCount: 500,
  kickoffDuration: 0.12, // detik (sama seperti aslinya; unit campur ms/detik dipertahankan demi kompatibilitas)
  xProgressDelay: 0.65,
  yProgressDelay: 0.2,
  xEasing: "power2.inOut",
  yEasing: "power1.in",
  kickoffEasing: "power1.out",
} as const;

const PIXEL_RATIO = { min: 1, max: 2 } as const;

const KICKOFF_ANIMATION = {
  scale: 0.97,
  opacity: 0.92,
  transformOrigin: "50% 100%",
} as const;

const ANCHOR_SIZE: Size = { width: 48, height: 48 };

/**
 * Style yang dipaksakan pada klon DOM saat rasterisasi.
 *
 * html-to-image menyalin computed style root ke klon lalu meletakkannya di dalam
 * <foreignObject> seukuran elemen. Akibatnya SETIAP offset posisi pada root
 * (left/top, fixed, relative, transform, translate) ikut tersalin dan menggeser isi
 * sehingga snapshot TERPOTONG (sudah diukur di Chromium: semua mode ini terpotong
 * dengan opsi lama, dan benar dengan opsi di bawah). Posisi elemen di layar tidak
 * dipengaruhi karena rect diukur terpisah lewat getBoundingClientRect().
 *
 * `opacity: 1` mencegah tween kickoff yang sedang berjalan ikut "terpotret".
 */
const CAPTURE_STYLE = {
  boxShadow: "none",
  border: "none",
  margin: "0",
  transform: "none",
  translate: "none",
  opacity: "1",
  top: "0",
  left: "0",
  right: "auto",
  bottom: "auto",
} as const;

// ---------------------------------------------------------------------------
// Tipe publik
// ---------------------------------------------------------------------------

export interface ViewportSource {
  getSnapshot(): Size;
}

/** Viewport default: langsung dari `window.innerWidth/innerHeight`. */
const windowViewport: ViewportSource = {
  getSnapshot: () => ({
    width: typeof window === "undefined" ? 0 : window.innerWidth,
    height: typeof window === "undefined" ? 0 : window.innerHeight,
  }),
};

type AnimationLifecycleHooks = {
  onBeforeAnimation?: (phase: GeniePhase) => void;
  onAfterAnimation?: (phase: GeniePhase) => void;
  onAnimationError?: (error: Error, phase: GeniePhase) => void;
};

export interface GenieOptions extends AnimationLifecycleHooks {
  /** Durasi animasi genie, dalam milidetik. */
  duration?: number;
  /** Jumlah baris mesh (dibatasi 1..1000 dan tinggi tekstur). */
  stripCount?: number;
  /** Durasi "kickoff" (mengecil sedikit sebelum genie) dalam DETIK. */
  kickoffDuration?: number;
  xProgressDelay?: number;
  yProgressDelay?: number;
  /** Nama easing GSAP, mis. "power2.inOut". */
  xAxisEasing?: string;
  yAxisEasing?: string;
  kickoffEasing?: string;
  kickoffScale?: number;
  kickoffOpacity?: number;
  pixelRatio?: number;
  /** Jika true, snapshot DOM tetap disimpan setelah `dispose()`. */
  enableTextureCache?: boolean;
  enableErrorLogging?: boolean;
  anchorSize?: Size;

  /** Sumber ukuran viewport. Bisa diisi `viewportObserver` milik proyek Anda. */
  viewport?: ViewportSource;
  /** Mipmap + anisotropic filtering agar hasil kecil di dock tidak shimmer. Default: true. */
  mipmaps?: boolean;
  /** MSAA untuk tepi miring window saat melengkung. Default: true. */
  antialias?: boolean;
  /** Style tambahan untuk klon DOM saat rasterisasi (menimpa CAPTURE_STYLE). */
  captureStyle?: Partial<CSSStyleDeclaration>;
}

// ---------------------------------------------------------------------------
// Internal
// ---------------------------------------------------------------------------

interface GLContext {
  renderer: WebGLRenderer;
  scene: Scene;
  camera: OrthographicCamera;
  material: MeshBasicMaterial;
  mesh: Mesh<BufferGeometry, MeshBasicMaterial>;
  size: Size;
  onContextLost: (event: Event) => void;
}

const hasWindow = (): boolean => typeof window !== "undefined";

export class WindowGenieThree {
  private canvas: HTMLCanvasElement | null = null;

  /** Hasil rasterisasi DOM (CPU). Sumber tekstur GPU. */
  private snapshot: HTMLCanvasElement | null = null;
  private capturePromise: Promise<HTMLCanvasElement> | null = null;

  private gl: GLContext | null = null;
  private texture: CanvasTexture | null = null;
  private geometry: BufferGeometry | null = null;
  private geometryRows = 0;

  private activeTween: gsap.core.Tween | null = null;
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
    readonly anchorSize: Size;
    readonly mipmaps: boolean;
    readonly antialias: boolean;
    readonly captureStyle: Partial<CSSStyleDeclaration>;
  };

  private readonly onBeforeAnimation?: (phase: GeniePhase) => void;
  private readonly onAfterAnimation?: (phase: GeniePhase) => void;
  private readonly onAnimationError?: (error: Error, phase: GeniePhase) => void;

  private readonly viewport: ViewportSource;

  private readonly xAxisEaseFunction: gsap.EaseFunction;
  private readonly yAxisEaseFunction: gsap.EaseFunction;
  private readonly kickoffEaseFunction: gsap.EaseFunction;

  private readonly listeners = new Set<VoidFunction>();
  private readonly rowScratch: RowState = { left: 0, right: 0, destination: 0 };

  constructor(options: GenieOptions = {}) {
    this.viewport = options.viewport ?? windowViewport;

    this.config = {
      duration: options.duration ?? ANIMATION_DEFAULTS.duration,
      stripCount: Math.max(1, Math.min(options.stripCount ?? ANIMATION_DEFAULTS.stripCount, 1000)),
      kickoffDuration: options.kickoffDuration ?? ANIMATION_DEFAULTS.kickoffDuration,
      xProgressDelay: gsap.utils.clamp(
        0,
        1,
        options.xProgressDelay ?? ANIMATION_DEFAULTS.xProgressDelay,
      ),
      yProgressDelay: gsap.utils.clamp(
        0,
        1,
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
      mipmaps: options.mipmaps ?? true,
      antialias: options.antialias ?? true,
      captureStyle: { ...CAPTURE_STYLE, ...options.captureStyle },
    };

    this.onBeforeAnimation = options.onBeforeAnimation;
    this.onAfterAnimation = options.onAfterAnimation;
    this.onAnimationError = options.onAnimationError;

    this.xAxisEaseFunction = gsap.parseEase(this.config.xAxisEasing);
    this.yAxisEaseFunction = gsap.parseEase(this.config.yAxisEasing);
    this.kickoffEaseFunction = gsap.parseEase(this.config.kickoffEasing);
  }

  // ==================== PUBLIC API (sama dengan versi Canvas 2D) ====================

  /**
   * Pasang canvas overlay. `null` = lepas dan bebaskan resource GPU.
   * Konteks WebGL dibuat malas (lazy) saat pertama kali dibutuhkan, sehingga
   * siklus attach → detach → attach (React StrictMode) tidak mahal.
   */
  public attach = (canvas: HTMLCanvasElement | null): void => {
    if (canvas === this.canvas) return;
    this.cancel();
    this.releaseGL();
    this.canvas = canvas;
  };

  public subscribe = (callback: VoidFunction): VoidFunction => {
    this.listeners.add(callback);
    return () => {
      this.listeners.delete(callback);
    };
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

  /**
   * Rasterisasi DOM lebih awal (mis. saat hover tombol minimize) supaya
   * `minimize()` tidak menunggu. Setelah selesai, tekstur langsung di-upload
   * ke GPU dan shader di-compile.
   */
  public prime = (elementNode: HTMLElement): void => {
    if (this.isAnimating || this.capturePromise || !hasWindow()) return;

    const capture = this.capture(elementNode).then((canvas) => {
      this.setSnapshot(canvas);
      return canvas;
    });
    this.capturePromise = capture;

    const release = () => {
      if (this.capturePromise === capture) this.capturePromise = null;
    };

    // Handler ganda → tidak pernah ada unhandled rejection (bug pada versi asli).
    capture.then(
      () => {
        release();
        this.warmUp();
      },
      (error) => {
        release();
        this.reportError(error, "minimize");
      },
    );
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

    // Ukur SEBELUM kickoff tween mengubah scale.
    const elementRect = elementNode.getBoundingClientRect();

    const pending = this.capturePromise;
    const capture = pending ?? this.capture(elementNode);

    if (!pending) {
      gsap.to(elementNode, {
        scale: this.config.kickoffScale,
        opacity: this.config.kickoffOpacity,
        duration: this.config.kickoffDuration,
        ease: this.kickoffEaseFunction,
        transformOrigin: KICKOFF_ANIMATION.transformOrigin,
      });
    }

    const hideElement = () => {
      gsap.killTweensOf(elementNode);
      gsap.set(elementNode, {
        clearProps: "scale,transformOrigin",
        opacity: 0,
        pointerEvents: "none",
      });
    };

    // then(onFulfilled, onRejected) — BUKAN then().catch(): error dari dalam
    // onFulfilled tidak lagi salah dilaporkan sebagai kegagalan capture.
    capture.then(
      (capturedCanvas) => {
        this.setSnapshot(capturedCanvas);
        hideElement();

        this.play("minimize", elementRect, dockTarget, () => {
          this.setAnimatingState(false);
          this.onAfterAnimation?.("minimize");
          onComplete?.();
        });
      },
      (error) => {
        this.reportError(error, "minimize");
        hideElement();
        this.setAnimatingState(false);
        onComplete?.();
      },
    );
  };

  public restore = (
    elementNode: HTMLElement,
    dockSource: Rect,
    onComplete?: VoidFunction,
  ): void => {
    if (this.isAnimating) {
      onComplete?.();
      return;
    }

    if (!this.snapshot || !this.canvas || !hasWindow()) {
      // Tidak bisa beranimasi → tampilkan window apa adanya.
      // (Versi asli membiarkan elemen tetap opacity:0 di jalur ini → window "hilang".)
      this.revealElement(elementNode);
      onComplete?.();
      return;
    }

    this.onBeforeAnimation?.("open");
    this.setAnimatingState(true);

    const elementRect = elementNode.getBoundingClientRect();

    this.play("open", elementRect, dockSource, () => {
      this.revealElement(elementNode);
      this.setAnimatingState(false);
      this.onAfterAnimation?.("open");
      onComplete?.();
    });
  };

  public pause = (): void => {
    this.activeTween?.pause();
  };

  public resume = (): void => {
    this.activeTween?.resume();
  };

  /** Hentikan animasi dan bersihkan canvas (versi asli meninggalkan frame terakhir di layar). */
  public cancel = (): void => {
    this.activeTween?.kill();
    this.activeTween = null;
    this.clearOutput();
    this.setAnimatingState(false);
  };

  /**
   * Lepaskan semua resource. Instance tetap aman dipakai ulang setelah
   * `attach()` berikutnya (penting untuk React StrictMode).
   */
  public dispose = (): void => {
    this.cancel();
    this.listeners.clear();
    this.releaseGL();
    this.canvas = null;

    if (!this.config.enableTextureCache) {
      this.snapshot = null;
    }
  };

  // ==================== PRIVATE ====================

  private capture(elementNode: HTMLElement): Promise<HTMLCanvasElement> {
    return toCanvas(elementNode, {
      pixelRatio: this.config.pixelRatio,
      cacheBust: false,
      style: this.config.captureStyle,
    });
  }

  private setSnapshot(canvas: HTMLCanvasElement): void {
    if (this.snapshot === canvas) return;
    this.disposeTexture();
    this.snapshot = canvas;
  }

  private revealElement(elementNode: HTMLElement): void {
    elementNode.style.opacity = "";
    elementNode.style.pointerEvents = "";
  }

  /** Jalankan satu animasi genie. Tidak pernah melempar; kegagalan → `done()`. */
  private play(
    phase: GeniePhase,
    elementRect: DOMRect,
    targetRect: Rect,
    done: VoidFunction,
  ): void {
    this.activeTween?.kill();

    try {
      const gl = this.ensureGL();
      const snapshot = this.snapshot;
      if (!gl || !snapshot) {
        throw new Error("WebGL renderer tidak tersedia (canvas belum di-attach?)");
      }

      const texture = this.ensureTexture(gl);
      const rows = Math.max(1, Math.min(snapshot.height, this.config.stripCount));
      const geometry = this.ensureGeometry(rows);
      const positions = geometry.getAttribute("position") as BufferAttribute;

      gl.material.map = texture;
      gl.material.needsUpdate = true;
      gl.mesh.geometry = geometry;

      const curve: GenieCurve = {
        phase,
        progress: 0,
        element: {
          x: elementRect.left,
          y: elementRect.top,
          width: elementRect.width,
          height: elementRect.height,
        },
        dock: targetRect,
        xDelay: this.config.xProgressDelay,
        yDelay: this.config.yProgressDelay,
        xEase: this.xAxisEaseFunction,
        yEase: this.yAxisEaseFunction,
      };

      const drawFrame = (progress: number) => {
        this.syncSize(gl);
        curve.progress = progress;
        writeGenieVertices(positions.array as Float32Array, rows, curve, this.rowScratch);
        positions.needsUpdate = true;
        gl.renderer.render(gl.scene, gl.camera);
      };

      this.syncSize(gl);
      gl.mesh.visible = true;
      drawFrame(0);

      const progress = { value: 0 };
      this.activeTween = gsap.to(progress, {
        value: 1,
        duration: this.config.duration / 1000,
        ease: "none",
        onUpdate: () => drawFrame(progress.value),
        onComplete: () => {
          this.clearOutput();
          this.activeTween = null;
          done();
        },
        onInterrupt: () => {
          this.activeTween = null;
        },
      });
    } catch (error) {
      this.reportError(error, phase);
      this.clearOutput();
      done();
    }
  }

  // -------------------- WebGL --------------------

  private ensureGL(): GLContext | null {
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

    // Kamera ortografis "piksel DOM": (0,0) di kiri-atas, Y ke bawah.
    const { width, height } = this.viewport.getSnapshot();
    const camera = new OrthographicCamera(0, width, 0, height, -1, 1);

    const material = new MeshBasicMaterial({
      transparent: true,
      side: DoubleSide, // sumbu Y terbalik + strip bisa saling menyilang pada easing ekstrem
      depthTest: false,
      depthWrite: false,
      toneMapped: false,
    });

    const mesh = new Mesh(new BufferGeometry(), material);
    mesh.frustumCulled = false;
    mesh.visible = false;
    scene.add(mesh);

    const onContextLost = (event: Event) => event.preventDefault(); // izinkan restore otomatis
    this.canvas.addEventListener("webglcontextlost", onContextLost);

    this.gl = {
      renderer,
      scene,
      camera,
      material,
      mesh,
      size: { width: 0, height: 0 },
      onContextLost,
    };
    this.syncSize(this.gl);
    return this.gl;
  }

  private syncSize(gl: GLContext): void {
    const { width, height } = this.viewport.getSnapshot();
    if (width === gl.size.width && height === gl.size.height) return;

    gl.size = { width, height };
    gl.renderer.setSize(width, height, true);
    gl.camera.left = 0;
    gl.camera.right = width;
    gl.camera.top = 0;
    gl.camera.bottom = height;
    gl.camera.updateProjectionMatrix();
  }

  private ensureTexture(gl: GLContext): CanvasTexture {
    if (this.texture) return this.texture;
    if (!this.snapshot) throw new Error("Snapshot DOM belum tersedia");

    const texture = new CanvasTexture(this.snapshot);
    texture.colorSpace = SRGBColorSpace;
    texture.magFilter = LinearFilter;
    texture.generateMipmaps = this.config.mipmaps;
    texture.minFilter = this.config.mipmaps ? LinearMipmapLinearFilter : LinearFilter;
    texture.anisotropy = Math.min(8, gl.renderer.capabilities.getMaxAnisotropy());

    this.texture = texture;
    return texture;
  }

  private ensureGeometry(rows: number): BufferGeometry {
    if (this.geometry && this.geometryRows === rows) return this.geometry;

    this.geometry?.dispose();

    const { uv, index } = buildGenieTopology(rows);
    const positions = new BufferAttribute(new Float32Array((rows + 1) * 6), 3);
    positions.setUsage(DynamicDrawUsage);

    const geometry = new BufferGeometry();
    geometry.setAttribute("position", positions);
    geometry.setAttribute("uv", new BufferAttribute(uv, 2));
    geometry.setIndex(new BufferAttribute(index, 1));

    this.geometry = geometry;
    this.geometryRows = rows;
    return geometry;
  }

  /** Upload tekstur + compile shader saat idle, supaya frame pertama animasi tidak tersendat. */
  private warmUp(): void {
    if (this.isAnimating || !this.canvas || !this.snapshot) return;

    try {
      const gl = this.ensureGL();
      if (!gl) return;

      const texture = this.ensureTexture(gl);
      const rows = Math.max(1, Math.min(this.snapshot.height, this.config.stripCount));

      gl.material.map = texture;
      gl.material.needsUpdate = true;
      gl.mesh.geometry = this.ensureGeometry(rows);

      gl.renderer.initTexture(texture);
      gl.mesh.visible = true;
      gl.renderer.compile(gl.scene, gl.camera);
      gl.mesh.visible = false;
    } catch {
      // best-effort; kegagalan sebenarnya akan dilaporkan di play()
    }
  }

  private clearOutput(): void {
    if (!this.gl) return;
    this.gl.mesh.visible = false;
    this.gl.renderer.clear();
  }

  private disposeTexture(): void {
    this.texture?.dispose();
    this.texture = null;
  }

  private releaseGL(): void {
    this.disposeTexture();
    this.geometry?.dispose();
    this.geometry = null;
    this.geometryRows = 0;

    const gl = this.gl;
    if (!gl) return;

    this.canvas?.removeEventListener("webglcontextlost", gl.onContextLost);
    gl.material.dispose();
    gl.renderer.dispose();
    this.gl = null;
  }

  // -------------------- util --------------------

  private normalizePixelRatio(pixelRatio?: number): number {
    if (!hasWindow()) return PIXEL_RATIO.min;
    const detected = pixelRatio ?? (window.devicePixelRatio || 1);
    return gsap.utils.clamp(PIXEL_RATIO.min, PIXEL_RATIO.max, detected);
  }

  private reportError(error: unknown, phase: GeniePhase): void {
    const message = error instanceof Error ? error.message : String(error);
    const wrapped = new Error(`Genie ${phase === "open" ? "restore" : phase} failed: ${message}`, {
      cause: error,
    });
    if (this.config.enableErrorLogging) console.error(wrapped);
    this.onAnimationError?.(wrapped, phase);
  }

  private setAnimatingState(isNowAnimating: boolean): void {
    if (this.isAnimating === isNowAnimating) return;
    this.isAnimating = isNowAnimating;
    for (const listener of this.listeners) listener();
  }
}

export function useWindowGenieThree(options: GenieOptions = {}) {
  const [genie] = useState(() => new WindowGenieThree(options));

  const isAnimating = useSyncExternalStore(
    genie.subscribe,
    genie.getSnapshot,
    genie.getServerSnapshot,
  );

  useEffect(() => () => genie.dispose(), [genie]);

  return { genie, isAnimating };
}
