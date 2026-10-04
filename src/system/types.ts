import type { ComponentType, PropsWithChildren } from "react";

import type {
  BufferGeometry,
  Camera,
  CanvasTexture,
  DataTexture,
  Mesh,
  Scene,
  ShaderMaterial,
  Vector2,
  Vector4,
  WebGLRenderer,
} from "three";
import type { JSONValue } from "es-toolkit/types";

export namespace System {
  export interface Registries {}

  export type Registry = import("#/system/process/registry.ts").ProcessRegistry;

  export type Processes = Record<string, Process.Instance<Process.Id>>;

  export namespace Genie {
    export type Phase = "minimized" | "open";

    export type EaseFn = (value: number) => number;

    export interface Viewport {
      getSnapshot(): Window.Size;
    }

    export interface LifecycleHooks {
      onBefore?(phase: Phase): void;
      onAfter?(phase: Phase): void;
      onError?(error: Error, phase: Phase): void;
    }

    export interface Options extends LifecycleHooks {
      /** Durasi animasi genie, dalam milidetik. */
      duration?: number;
      /** Jumlah baris mesh (dibatasi 1..1000). Dengan shader, murah dinaikkan. */
      strip?: number;
      /** Durasi "kickoff" (mengecil sedikit sebelum genie) dalam DETIK. */
      kickoffDuration?: number;
      xProgressDelay?: number;
      yProgressDelay?: number;
      /** Nama easing GSAP, mis. "power2.inOut". Dibakar ke LUT 256 sampel. */
      xAxisEasing?: string;
      yAxisEasing?: string;
      kickoffEasing?: string;
      kickoffScale?: number;
      kickoffOpacity?: number;
      pixelRatio?: number;
      /** Jika true, snapshot DOM tetap disimpan setelah `dispose()`. */
      enableTextureCache?: boolean;
      enableErrorLogging?: boolean;
      toSize?: Window.Size;
      /** Sumber ukuran viewport. Default: `window.innerWidth/innerHeight`. */
      viewport?: Viewport;
      /** Mipmap + anisotropic filtering agar hasil kecil di dock tidak shimmer. Default: true. */
      mipmaps?: boolean;
      /** MSAA untuk tepi miring window saat melengkung. Default: true. */
      antialias?: boolean;
      /** Style tambahan untuk klon DOM saat rasterisasi (menimpa GENIE_CAPTURE_STYLE). */
      captureStyle?: Partial<CSSStyleDeclaration>;
      /**
       * Seberapa gelap bagian yang paling terjepit (0 = tanpa shading, 1 = hitam).
       * Default: 0.18. Set 0 untuk tampilan identik dengan versi non-shader.
       */
      pinchShading?: number;
    }

    /** Konfigurasi akhir: semua opsi sudah terisi default (viewport & hooks disimpan terpisah). */
    export type Config = Readonly<Required<Omit<Options, "viewport" | keyof LifecycleHooks>>>;

    /** Semua yang dibutuhkan untuk menghitung satu frame (referensi CPU). */
    export interface Curve {
      phase: Phase;
      /** 0..1, progres global animasi (linear; easing diterapkan per-strip). */
      progress: number;
      /** Rect window (posisi terakhir di layar). */
      from: Window.Rect;
      /** Rect dock / target. */
      to: Window.Rect;
      xDelay: number;
      yDelay: number;
      xEase: EaseFn;
      yEase: EaseFn;
    }

    /** Hasil sampel satu baris. */
    export interface State {
      left: number;
      right: number;
      /** Posisi Y (piksel viewport) baris ini. */
      destination: number;
    }

    export interface Uniform {
      [uniform: string]: { value: unknown };
      uMap: { value: CanvasTexture | null };
      uEaseX: { value: DataTexture };
      uEaseY: { value: DataTexture };
      uProgress: { value: number };
      uOpen: { value: number };
      uFrom: { value: Vector4 };
      uTo: { value: Vector4 };
      uDelay: { value: Vector2 };
      uViewport: { value: Vector2 };
      uShade: { value: number };
    }

    export interface GLContext {
      renderer: WebGLRenderer;
      scene: Scene;
      camera: Camera;
      material: ShaderMaterial;
      uniforms: Uniform;
      mesh: Mesh<BufferGeometry, ShaderMaterial>;
      easeX: DataTexture;
      easeY: DataTexture;
      size: Window.Size;
      onContextLost: (event: Event) => void;
    }
  }

  export interface Module {
    default?: (registry: Registry) => void;
  }

  export namespace Dock {
    export interface Instance
      extends Process.Base<Process.Id>, Pick<Window.State, "closed" | "maximized" | "minimized"> {
      icon?: ComponentType<any>;
      pid: string | null;
      focused: boolean;
      running: boolean;
      singleton: boolean;
      count: number;
    }

    export interface Presence extends Instance {
      completed: boolean;
    }
  }

  export namespace Window {
    export interface Size {
      width: number;
      height: number;
    }

    export interface Position {
      x: number;
      y: number;
    }

    export type Rect = Size & Position;

    export interface State {
      size: Size;
      resizable: boolean;
      closed: boolean;
      maximized: boolean;
      minimized: boolean;
    }
  }
  export namespace Desktop {}

  export interface Definition<T extends Process.Id = Process.Id> extends Process.Base<T> {
    Wrap?: ComponentType<Process.ComponentProps & PropsWithChildren>;
    Component: ComponentType<Process.ComponentProps>;
    window?: Partial<Window.State>;
    singleton?: boolean;
    pinned?: boolean;
  }

  export namespace Process {
    export type Id = keyof Registries extends never ? string : keyof Registries | (string & {});
    export type SequenceId<T extends Id = Id> = {
      id: T;
      sequence: number;
    };

    export interface Base<T extends Id = Id> {
      id: T;
      title: string;
    }

    export interface ComponentProps {
      pid: string;
    }

    export interface Instance<T extends Id = Id> extends Base<T> {
      pid: string;
      window: Window.State;
      createdAt: number;
    }

    export interface Store {
      processes: Processes;
      pid: string | null;
      orders: string[];
    }

    export type Actions = {
      open(id: Id): string;
      close(pid: string, forced?: boolean): void;
      minimize(pid: string, forced?: boolean): void;
      maximize(pid: string, forced?: boolean): void;
      focus(pid: string): void;
      blur(): void;
    };

    export type ActionName = keyof Actions;
  }

  export namespace Devtools {
    export type Tab = "actions" | "state" | "processes";

    export type Outcome<T> =
      | { readonly status: "success"; readonly value: T }
      | { readonly status: "error"; readonly error: unknown };

    export interface EntryOf<K extends Process.ActionName> {
      readonly id: number;
      readonly name: K;
      readonly args: Parameters<Process.Actions[K]>;
      readonly at: number;
      readonly duration: number;
      readonly before: Process.Store;
      readonly after: Process.Store;
      readonly changed: boolean;
      readonly outcome: Outcome<ReturnType<Process.Actions[K]>>;
    }

    export type Entry = { [K in Process.ActionName]: EntryOf<K> }[Process.ActionName];

    export interface FieldChange {
      path: string;
      from: JSONValue;
      to: JSONValue;
    }

    export interface ProcessChange {
      pid: string;
      fields: FieldChange[];
    }

    export interface Diff {
      pid: {
        from: string | null;
        to: string | null;
      } | null;
      orders: boolean;
      added: string[];
      removed: string[];
      changed: ProcessChange[];
    }

    export interface State {
      readonly entries: ReadonlyArray<Entry>;
      readonly paused: boolean;
    }

    export interface Target {
      state: Process.Store;
      actions: Process.Actions;
    }
  }
}
