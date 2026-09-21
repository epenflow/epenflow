import { useCallback, useRef, useState } from "react";

import { gsap, useGSAP } from "#/lib/gsap.ts";
import { useIsPrefersReducedMotion } from "#/hooks/use-media-query.ts";

export const DOCK_ITEM_SIZE = 48;

interface UseDockOptions {
  disabled?: boolean;
  scale?: number;
  size?: number;
}

export function useDockMagnification({
  disabled = false,
  scale = 1.6,
  size = DOCK_ITEM_SIZE,
}: UseDockOptions = {}) {
  const listRef = useRef<HTMLElement>(null);
  const itemsRef = useRef<Map<unknown, HTMLElement>>(new Map());
  const cachedRef = useRef<Map<HTMLElement, { center: number }>>(new Map());
  const quickSettersRef = useRef<Map<HTMLElement, (value: number) => void>>(new Map());
  const [mounted, setMounted] = useState(false);

  const isReducedMotion = useIsPrefersReducedMotion();

  useGSAP(
    (_, contextSafe) => {
      const container = listRef.current;

      if (!container || !contextSafe || disabled || !mounted) return;

      const getItems = () => [...itemsRef.current.values()];

      const setterFor = (node: HTMLElement) => {
        let setter = quickSettersRef.current.get(node);

        if (!setter) {
          setter = gsap.quickTo(node, "width", {
            duration: isReducedMotion ? 0 : 0.25,
            ease: isReducedMotion ? "none" : "power3.out",
          });
          quickSettersRef.current.set(node, setter);
        }

        return setter;
      };

      const reset = () => {
        for (const item of getItems()) {
          setterFor(item)(size);
        }
      };

      const invalidate = () => {
        const cached = cachedRef.current;

        for (const item of getItems()) {
          const rect = item.getBoundingClientRect();
          cached.set(item, { center: rect.left + rect.width / 2 });
        }
      };

      const pointerenter = contextSafe(() => {
        invalidate();
      });

      const pointermove = contextSafe((event: PointerEvent) => {
        if (event.pointerType !== "mouse") return;

        const items = getItems();
        if (items.length === 0) return;

        const bound = size * 2.5;

        for (const item of items) {
          let center: number;
          const cached = cachedRef.current.get(item);

          if (cached) {
            center = cached.center;
          } else {
            const rect = item.getBoundingClientRect();
            center = rect.left + rect.width / 2;
          }

          const distance = Math.abs(center - event.clientX);

          const setter = setterFor(item);

          if (distance < bound) {
            setter(size * (1 + (scale - 1) * Math.cos((distance / bound) * (Math.PI / 2))));
          } else {
            setter(size);
          }
        }
      });

      const pointerleave = contextSafe(() => {
        reset();
      });

      const controller = new AbortController();

      container.addEventListener("pointerenter", pointerenter, { signal: controller.signal });
      container.addEventListener("pointermove", pointermove, { signal: controller.signal });
      container.addEventListener("pointerleave", pointerleave, { signal: controller.signal });

      return () => {
        controller.abort();
        reset();
      };
    },
    { scope: listRef, dependencies: [disabled, scale, size, mounted, isReducedMotion] },
  );

  const onRegisterListRef = useCallback(<T extends HTMLElement = HTMLElement>(node: T | null) => {
    listRef.current = node;
    setMounted(true);

    return () => {
      listRef.current = null;
      setMounted(false);
    };
  }, []);

  const onRegisterItemRef = useCallback(
    <T, E extends HTMLElement = HTMLElement>(id: T) =>
      (node: E | null) => {
        const registries = itemsRef.current;

        if (node) {
          registries.set(id, node);
        }

        return () => {
          registries.delete(id);
          if (node) {
            cachedRef.current.delete(node);
            quickSettersRef.current.delete(node);
          }
        };
      },
    [],
  );

  return [onRegisterListRef, onRegisterItemRef] as const;
}
