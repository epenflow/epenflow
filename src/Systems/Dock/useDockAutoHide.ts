import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type FocusEvent,
  type PointerEvent,
} from "react";

const SHOW_DELAY = 120;
const HIDE_DELAY = 350;

export function useDockAutoHide(enabled: boolean) {
  const focusRef = useRef(false);
  const pointerRef = useRef(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>(undefined);
  const [engaged, setEngaged] = useState<boolean>(false);

  const sync = useCallback((delay: number) => {
    clearTimeout(timeoutRef.current);
    const next = pointerRef.current || focusRef.current;
    timeoutRef.current = setTimeout(() => setEngaged(next), delay);
  }, []);

  useEffect(() => () => clearTimeout(timeoutRef.current), []);

  const props = useMemo(
    () => ({
      onPointerEnter: (event: PointerEvent) => {
        if (event.pointerType !== "mouse") return;

        pointerRef.current = true;
        sync(SHOW_DELAY);
      },
      onPointerLeave: (event: PointerEvent) => {
        if (event.pointerType !== "mouse") return;

        pointerRef.current = false;
        sync(HIDE_DELAY);
      },
      onFocus: (event: FocusEvent) => {
        if (!event.target.matches(":focus-visible")) return;

        focusRef.current = true;
        sync(0);
      },
      onBlur: (event: FocusEvent) => {
        if (event.currentTarget.contains(event.relatedTarget)) return;

        focusRef.current = false;
        sync(HIDE_DELAY);
      },
    }),
    [sync],
  );

  return [enabled && !engaged, props] as const;
}
