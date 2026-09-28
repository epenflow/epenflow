import {
  useCallback,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
  type FocusEvent,
  type PointerEvent,
} from "react";

import type { System } from "#/system/types.ts";
import { registry } from "#/system/process/index.ts";
import { useInstances, useProcessSelector } from "#/system/process/hooks.ts";
import { createDockPresences } from "#/system/dock/utils.ts";
import {
  DOCK_ENGAGE_HIDE_DELAY,
  DOCK_ENGAGE_SHOW_DELAY,
  DOCK_MAGNIFY_SCALE,
  DOCK_MAGNIFY_SIZE,
  WINDOW_STATE_VALUES,
} from "#/system/constants.ts";
import { gsap, useGSAP } from "#/lib/gsap.ts";
import { useIsReduceMotion } from "#/hooks/use-media-query.ts";

export function useDockMagnify(enabled: boolean = true) {
  const groupRef = useRef<HTMLElement>(null);
  const entriesRef = useRef<Map<unknown, HTMLElement>>(new Map());
  const quickSettersRef = useRef<Map<HTMLElement, (value: number) => void>>(new Map());
  const cachedRef = useRef<Map<HTMLElement, { size: number; scale: number; center: number }>>(
    new Map(),
  );

  const [mounted, setMounted] = useState<boolean>(false);

  const reduced = useIsReduceMotion();

  const setterFor = useCallback(
    (node: HTMLElement) => {
      let setter = quickSettersRef.current.get(node);

      if (!setter) {
        setter = gsap.quickTo(node, "width", {
          duration: reduced ? 0 : 0.25,
          ease: reduced ? "none" : "power4.out",
        });
        quickSettersRef.current.set(node, setter);
      }

      return setter;
    },
    [reduced],
  );

  useGSAP(
    (_, contextSafe) => {
      const group = groupRef.current;
      const entries = entriesRef.current;

      if (!enabled || !mounted || !contextSafe || !group || entries.size === 0) return;

      const reset = () => {
        for (const entry of entries.values()) {
          setterFor(entry)(parseFloat(entry.getAttribute("data-size") ?? `${DOCK_MAGNIFY_SIZE}`));
        }
      };

      const revalidate = () => {
        const cached = cachedRef.current;

        for (const entry of entries.values()) {
          const rect = entry.getBoundingClientRect();
          cached.set(entry, {
            center: rect.left + rect.width / 2,
            scale: parseFloat(entry.getAttribute("data-scale") ?? `${DOCK_MAGNIFY_SCALE}`),
            size: parseFloat(entry.getAttribute("data-size") ?? `${DOCK_MAGNIFY_SIZE}`),
          });
        }
      };

      const pointerenter = contextSafe(() => {
        revalidate();
      });

      const pointermove = contextSafe((event: globalThis.PointerEvent) => {
        if (event.pointerType !== "mouse") return;

        if (entriesRef.current.size === 0) return;

        for (const entry of entries.values()) {
          const cached = cachedRef.current.get(entry);

          let center: number;
          let size: number;
          let scale: number;

          if (cached) {
            size = cached.size;
            scale = cached.scale;
            center = cached.center;
          } else {
            const rect = entry.getBoundingClientRect();
            size = parseFloat(entry.getAttribute("data-size") ?? `${DOCK_MAGNIFY_SIZE}`);
            scale = parseFloat(entry.getAttribute("data-scale") ?? `${DOCK_MAGNIFY_SCALE}`);
            center = rect.left + rect.width / 2;
          }

          const bound = scale * size;
          const distance = Math.abs(center - event.clientX);
          const setter = setterFor(entry);

          if (distance < bound) {
            setter(
              size * (1 + (DOCK_MAGNIFY_SCALE - 1) * Math.cos((distance / bound) * (Math.PI / 2))),
            );
          } else {
            setter(size);
          }
        }
      });

      const pointerleave = contextSafe(() => {
        reset();
      });

      const controller = new AbortController();

      group.addEventListener("pointerenter", pointerenter, { signal: controller.signal });
      group.addEventListener("pointermove", pointermove, { signal: controller.signal });
      group.addEventListener("pointerleave", pointerleave, { signal: controller.signal });

      return () => {
        controller.abort();
        reset();
      };
    },
    {
      scope: groupRef,
      dependencies: [enabled, mounted],
    },
  );

  const registerGroupRef = useCallback((node: HTMLElement | null) => {
    groupRef.current = node;
    setMounted(true);

    return () => {
      groupRef.current = null;
      setMounted(false);
    };
  }, []);

  const registerEntryRef = useCallback(
    <T>(id: T) =>
      (node: HTMLElement | null) => {
        const entries = entriesRef.current;

        if (node) {
          entries.set(id, node);
        }

        return () => {
          entries.delete(id);

          if (node) {
            cachedRef.current.delete(node);
            quickSettersRef.current.delete(node);
          }
        };
      },
    [],
  );

  return [registerGroupRef, registerEntryRef] as const;
}

export function useDockEngage(enabled: boolean) {
  const focusRef = useRef<boolean>(false);
  const pointerRef = useRef<boolean>(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>(undefined);
  const [engaged, setEngaged] = useState<boolean>(false);

  const sync = useCallback((delay: number) => {
    clearTimeout(timeoutRef.current);
    const next = pointerRef.current || focusRef.current;
    timeoutRef.current = setTimeout(() => setEngaged(next), delay);
  }, []);

  const props = useMemo(
    () => ({
      onPointerEnter: (event: PointerEvent) => {
        if (event.pointerType !== "mouse") return;
        pointerRef.current = true;
        sync(DOCK_ENGAGE_SHOW_DELAY);
      },
      onPointerLeave: (event: PointerEvent) => {
        if (event.pointerType !== "mouse") return;
        pointerRef.current = false;
        sync(DOCK_ENGAGE_HIDE_DELAY);
      },
      onFocus: (event: FocusEvent) => {
        if (!event.target.matches(":focus-visible")) return;
        focusRef.current = true;
        sync(0);
      },
      onBlur: (event: FocusEvent) => {
        if (event.currentTarget.contains(event.relatedTarget)) return;
        focusRef.current = false;
        sync(DOCK_ENGAGE_HIDE_DELAY);
      },
    }),
    [sync],
  );

  return [enabled && !engaged, props] as const;
}

export function useDockInstances() {
  const currentInstances = useInstances();
  const currentProcessId = useProcessSelector((state) => state.pid);

  return useMemo((): System.Dock.Instance[] => {
    const instances = new Map<System.Process.Id, System.Process.Instance[]>();

    for (const currentInstance of currentInstances) {
      let foundInstance = instances.get(currentInstance.id);

      if (!foundInstance) {
        foundInstance = [];
        instances.set(currentInstance.id, foundInstance);
      }

      foundInstance.push(currentInstance);
    }

    const create = (id: System.Process.Id): System.Dock.Instance => {
      const definition = registry.get(id);
      const instance = instances.get(id) ?? [];

      const currentInstance = instance.find((current) => current.pid === currentProcessId);
      const nextInstance = currentInstance ?? instance.at(-1) ?? null;

      return {
        id,
        title: definition?.title ?? id,
        pid: nextInstance?.pid ?? null,
        running: instance.length > 0,
        focused: nextInstance?.pid === currentProcessId,
        closed: nextInstance?.window.closed ?? WINDOW_STATE_VALUES.closed,
        minimized: nextInstance?.window.minimized ?? WINDOW_STATE_VALUES.minimized,
        maximized: nextInstance?.window.maximized ?? WINDOW_STATE_VALUES.maximized,
        singleton: definition?.singleton ?? false,
        count: instance.length,
      };
    };

    const definitions = registry.getMany().filter((definition) => definition.pinned);
    const identifiers = new Set(definitions.map((definition) => definition.id));

    const runnings = [...instances.entries()]
      .filter(([id]) => !identifiers.has(id))
      .sort(
        ([, a], [, b]) =>
          Math.min(...a.map((instance) => instance.createdAt)) -
          Math.min(...b.map((instance) => instance.createdAt)),
      )
      .map(([id]) => id);

    return [...definitions.map((definition) => create(definition.id)), ...runnings.map(create)];
  }, [currentInstances, currentProcessId]);
}

export function useDockPresences(instances: System.Dock.Instance[]) {
  const [store] = useState(() => createDockPresences(instances));

  const snapshot = useSyncExternalStore(
    store.subscribe,
    store.getSnapshot,
    store.getServerSnapshot,
  );

  useLayoutEffect(() => {
    store.sync(instances);
  }, [store, instances]);

  return [snapshot, store.onComplete] as const;
}
