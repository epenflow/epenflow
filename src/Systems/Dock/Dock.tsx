import {
  Activity,
  Suspense,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type MouseEvent,
} from "react";

import { cn } from "cn";
import { ProcessStore } from "#/Systems/Process/ProcessStore.ts";
import { useDockProcesses } from "#/Systems/Dock/useDockProcesses.ts";
import { useDockPresences } from "#/Systems/Dock/useDockPresences.ts";
import { DOCK_ITEM_SIZE, useDockMagnification } from "#/Systems/Dock/useDockMagnification.ts";
import { DockPrimitive } from "#/Systems/Dock/DockPrimitive.tsx";
import type { Systems } from "#/lib/types.ts";
import { gsap, useGSAP } from "#/lib/gsap.ts";
import { DOCK_ANCHOR, DOCK_SIZE } from "#/lib/constants.ts";
import { useMounted } from "#/hooks/use-mounted.ts";
import { useIsPrefersReducedMotion } from "#/hooks/use-media-query.ts";

const DOCK_GAP = 8;
const ENTER_DURATION = 0.35;
const EXIT_DURATION = 0.3;
const BOUNCE_COUNT = 3;
const BOUNCE_HEIGHT = DOCK_ITEM_SIZE * 0.5;
const BOUNCE_HALF_DURATION = 0.26;

export function Dock() {
  const listRef = useRef<HTMLElement>(null);
  const timerRef = useRef<NodeJS.Timeout>(null);
  const mounted = useMounted();
  const processes = useDockProcesses();
  const [presences, onComplete] = useDockPresences(processes);
  const [onRegisterListRef, onRegisterItemRef] = useDockMagnification();
  const [isVisible, setVisible] = useState(false);
  const hide = useMemo(
    () => presences.some((process) => process.maximized && !process.minimized),
    [presences],
  );

  useEffect(() => {
    if (!hide || isVisible) return;

    const handleMouseMove = (event: globalThis.MouseEvent) => {
      const bottom = event.clientY >= window.innerHeight - DOCK_SIZE;

      if (bottom && listRef.current) {
        const rect = listRef.current.getBoundingClientRect();
        const isWithinX = event.clientX >= rect.left && event.clientX <= rect.right;

        if (isWithinX) {
          if (!timerRef.current) {
            timerRef.current = setTimeout(() => {
              setVisible(true);
              timerRef.current = null;
            }, 150);
          }
        } else {
          if (timerRef.current) {
            clearTimeout(timerRef.current);
            timerRef.current = null;
          }
        }
      } else {
        if (timerRef.current) {
          clearTimeout(timerRef.current);
          timerRef.current = null;
        }
      }
    };

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [hide, isVisible]);

  useGSAP(() => {
    const show = isVisible || !hide;

    gsap.to(listRef.current, {
      y: show ? 0 : 120,
      opacity: show ? 1 : 0,
      duration: 0.4,
      ease: "power3.out",
      overwrite: "auto",
    });
  }, [isVisible, hide]);

  const onRegisterRef = useCallback(
    (node: HTMLElement | null) => {
      listRef.current = node;
      const unregister = onRegisterListRef(node);
      return () => {
        listRef.current = null;
        unregister();
      };
    },
    [onRegisterListRef],
  );

  const onMouseEnter = useCallback(() => {
    if (!hide) return;
    setVisible(true);
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, [hide]);

  const onMouseLeave = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    setVisible(false);
  }, []);

  if (presences.length === 0) return null;

  return (
    <DockPrimitive onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
      <DockPrimitive.List ref={onRegisterRef}>
        {presences.map((process) => {
          return (
            <Suspense key={process.id}>
              <DockItem
                process={process}
                animated={mounted}
                onComplete={onComplete}
                onRegisterRef={onRegisterItemRef}
              />
            </Suspense>
          );
        })}
      </DockPrimitive.List>
    </DockPrimitive>
  );
}

export const DockDOM = {
  assign: (id: string) => ({ "data-dock": `${DOCK_ANCHOR}${id}` }),
  query: <T extends HTMLElement = HTMLElement>(id: string): T | null =>
    document.querySelector<T>(`[data-dock="${DOCK_ANCHOR}${id}"]`),
};

interface DockItemProps {
  process: Systems.Dock.Presence;
  animated: boolean;
  onComplete: (id: string) => void;
  onRegisterRef: ReturnType<typeof useDockMagnification>[1];
}

function DockItem({
  process,
  animated,
  onComplete,
  onRegisterRef: onRegisterRefProp,
}: DockItemProps) {
  const scopeRef = useRef<HTMLElement>(null);
  const interruptRef = useRef<boolean>(false);

  const isReducedMotion = useIsPrefersReducedMotion();

  const running = process.running && !process.completed;

  useGSAP(
    () => {
      const scope = scopeRef.current;
      if (!scope || !animated) return;

      if (isReducedMotion) {
        gsap.fromTo(scope, { opacity: 0 }, { opacity: 1, duration: 0.15, clearProps: true });
        return;
      }

      gsap.fromTo(
        scope,
        { maxWidth: 0, marginRight: -DOCK_GAP, opacity: 0 },
        {
          maxWidth: DOCK_ITEM_SIZE,
          marginRight: 0,
          opacity: 1,
          duration: ENTER_DURATION,
          ease: "power3.out",
          clearProps: true,
        },
      );
    },
    { scope: scopeRef, dependencies: [] },
  );

  useGSAP(
    () => {
      if (!animated || !running || isReducedMotion) return;

      gsap.fromTo(
        "span",
        { scale: 0, opacity: 0 },
        {
          scale: 1,
          opacity: 1,
          duration: 0.3,
          ease: "back.out(2.5)",
          clearProps: true,
        },
      );

      gsap.to("button", {
        y: -BOUNCE_HEIGHT,
        duration: BOUNCE_HALF_DURATION,
        ease: "power2.out",
        repeat: BOUNCE_COUNT * 2 - 1,
        yoyo: true,
        onComplete: () => gsap.set("button", { clearProps: true }),
      });
    },
    { scope: scopeRef, dependencies: [running, isReducedMotion] },
  );

  useGSAP(
    () => {
      const scope = scopeRef.current;
      if (!scope) return;

      if (process.completed) {
        interruptRef.current = true;
        gsap.fromTo(
          scope,
          { maxWidth: scope.offsetWidth },
          {
            maxWidth: 0,
            marginRight: -DOCK_GAP,
            opacity: 0,
            duration: isReducedMotion ? 0 : EXIT_DURATION,
            ease: "power2.inOut",
            overwrite: "auto",
            onComplete: () => onComplete(process.id),
          },
        );
        return;
      }

      if (interruptRef.current) {
        interruptRef.current = false;

        gsap.to(scope, {
          maxWidth: DOCK_ITEM_SIZE,
          marginRight: 0,
          opacity: 1,
          duration: isReducedMotion ? 0 : ENTER_DURATION,
          ease: "power3.out",
          overwrite: "auto",
          clearProps: true,
        });
      }
    },
    { scope: scopeRef, dependencies: [process.completed, process.id, onComplete, isReducedMotion] },
  );

  const onRegisterRef = useCallback(
    (node: HTMLElement | null) => {
      scopeRef.current = node;
      const unregister = onRegisterRefProp(process.id)(node);

      return () => {
        scopeRef.current = null;
        unregister();
      };
    },
    [process.id, onRegisterRefProp],
  );

  const onOpenChange = useCallback(
    (event: MouseEvent<HTMLButtonElement>) => {
      event.preventDefault();

      if (!process.pid) {
        ProcessStore.actions.open(process.id);
        return;
      }

      if (process.singleton && process.focused && !process.minimized) {
        ProcessStore.actions.minimize(process.pid, true);
        return;
      }
      if (process.minimized) {
        ProcessStore.actions.minimize(process.pid, false);
      }

      ProcessStore.actions.focus(process.pid);
    },
    [process.pid, process.singleton, process.focused, process.minimized, process.id],
  );

  return (
    <DockPrimitive.Item
      ref={onRegisterRef}
      className="relative flex items-end justify-center"
      {...DockDOM.assign(process.id)}>
      <DockPrimitive.Button
        onClick={onOpenChange}
        className="transition-[filter] duration-150 ease-out active:brightness-75">
        {process.title.slice(0, 1)}
      </DockPrimitive.Button>
      <Activity mode={running ? "visible" : "hidden"}>
        <span
          className={cn(
            "absolute -bottom-1 left-1/2 -ml-0.5 size-1 rounded-full transition-colors duration-500 ease-in-out",
            process.focused ? "bg-info" : !process.minimized ? "bg-warning" : "bg-foreground",
          )}
        />
      </Activity>
    </DockPrimitive.Item>
  );
}
