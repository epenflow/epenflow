import { useEffect, useEffectEvent, type RefObject } from "react";

export function useEventListener<K extends keyof MediaQueryListEventMap>(
  eventName: K,
  handler: (event: MediaQueryListEventMap[K]) => void,
  element: RefObject<MediaQueryList>,
  options?: boolean | AddEventListenerOptions,
): void;
export function useEventListener<K extends keyof WindowEventMap>(
  eventName: K,
  handler: (event: WindowEventMap[K]) => void,
  element?: undefined,
  options?: boolean | AddEventListenerOptions,
): void;
export function useEventListener<
  K extends keyof HTMLElementEventMap & keyof SVGElementEventMap,
  T extends Element = K extends keyof HTMLElementEventMap ? HTMLDivElement : SVGElement,
>(
  eventName: K,
  handler: ((event: HTMLElementEventMap[K]) => void) | ((event: SVGElementEventMap[K]) => void),
  element: RefObject<T>,
  options?: boolean | AddEventListenerOptions,
): void;
export function useEventListener<K extends keyof DocumentEventMap>(
  eventName: K,
  handler: (event: DocumentEventMap[K]) => void,
  element: RefObject<Document>,
  options?: boolean | AddEventListenerOptions,
): void;
export function useEventListener<
  W extends keyof WindowEventMap,
  H extends keyof HTMLElementEventMap & keyof SVGElementEventMap,
  M extends keyof MediaQueryListEventMap,
  T extends HTMLElement | SVGAElement | MediaQueryList = HTMLElement,
>(
  eventName: W | H | M,
  handler: (
    event:
      | WindowEventMap[W]
      | HTMLElementEventMap[H]
      | SVGElementEventMap[H]
      | MediaQueryListEventMap[M]
      | Event,
  ) => void,
  element?: RefObject<T>,
  options?: boolean | AddEventListenerOptions,
) {
  const listener: typeof handler = useEffectEvent((event) => {
    handler(event);
  });

  useEffect(() => {
    const target: T | Window = element?.current ?? window;

    if (!(target && target.addEventListener)) return;

    target.addEventListener(eventName, listener, options);

    return () => {
      target.removeEventListener(eventName, listener, options);
    };
  }, [eventName, element, options]);
}
