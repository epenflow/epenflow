import { Activity, Suspense, useCallback, useRef, type MouseEvent } from "react";

import { cn } from "cn";
import type { System } from "#/system/types.ts";
import { focus, minimize, open } from "#/system/process/index.ts";
import { useHasMaximizedInstances } from "#/system/process/hooks.ts";
import { DockDOM } from "#/system/dock/utils.ts";
import { DockPrimitive } from "#/system/dock/primitive.tsx";
import {
  useDockEngage,
  useDockInstances,
  useDockMagnify,
  useDockPresences,
} from "#/system/dock/hooks.ts";
import {
  DOCK_GROUP_STYLE,
  DOCK_ITEM_BOUNCE_COUNT,
  DOCK_ITEM_BOUNCE_HALF_DURATION,
  DOCK_ITEM_BOUNCE_HEIGHT,
  DOCK_ITEM_ENTER_DURATION,
  DOCK_ITEM_EXIT_DURATION,
  DOCK_ITEM_GAP,
  DOCK_ITEM_SIZE,
} from "#/system/constants.ts";
import { gsap, useGSAP } from "#/lib/gsap.ts";
import { useIsMouseDevice, useIsReduceMotion } from "#/hooks/use-media-query.ts";
import { useIsMounted } from "#/hooks/use-is-mounted.ts";

export function Dock() {
  const mounted = useIsMounted();
  const instances = useDockInstances();
  const isMouseDevice = useIsMouseDevice();
  const maximized = useHasMaximizedInstances();

  const hidden = maximized && isMouseDevice;

  const [engaged, props] = useDockEngage(hidden);
  const [registerGroupRef, registerEntryRef] = useDockMagnify();
  const [presences, onComplete] = useDockPresences(instances);

  if (instances.length === 0) return null;

  return (
    <DockPrimitive data-slot="dock" {...props}>
      <div
        aria-hidden={true}
        className={cn(
          "absolute inset-x-0 top-full h-10",
          hidden ? "pointer-events-auto" : "pointer-events-none",
        )}
      />
      <DockPrimitive.Group
        data-slot="dock-group"
        ref={registerGroupRef}
        style={DOCK_GROUP_STYLE}
        className={cn(
          "transition-[translate,opacity] duration-500 ease-out",
          engaged && "translate-y-full opacity-0",
        )}>
        {presences.map((instance) => (
          <Suspense key={instance.id}>
            <DockItem
              instance={instance}
              mounted={mounted}
              onComplete={onComplete}
              onRegisterRef={registerEntryRef}
            />
          </Suspense>
        ))}
      </DockPrimitive.Group>
    </DockPrimitive>
  );
}

interface DockItemProps {
  instance: System.Dock.Presence;
  mounted: boolean;
  onComplete: (id: string) => void;
  onRegisterRef: (id: string) => (node: HTMLElement | null) => VoidFunction;
}

function DockItem({
  instance,
  mounted,
  onComplete,
  onRegisterRef: onRegisterRefProp,
}: DockItemProps) {
  const scopeRef = useRef<HTMLElement>(null);
  const interruptRef = useRef<boolean>(false);

  const isReducedMotion = useIsReduceMotion();

  const running = instance.running && !instance.completed;

  useGSAP(
    () => {
      const scope = scopeRef.current;
      if (!scope || !mounted) return;

      if (isReducedMotion) {
        gsap.fromTo(scope, { opacity: 0 }, { opacity: 1, duration: 0.15, clearProps: true });
        return;
      }

      gsap.fromTo(
        scope,
        { maxWidth: 0, marginRight: -DOCK_ITEM_GAP, opacity: 0 },
        {
          maxWidth: DOCK_ITEM_SIZE,
          marginRight: 0,
          opacity: 1,
          duration: DOCK_ITEM_ENTER_DURATION,
          ease: "power3.out",
          clearProps: true,
        },
      );
    },
    { scope: scopeRef, dependencies: [mounted] },
  );

  useGSAP(
    () => {
      if (!mounted || !running || isReducedMotion) return;

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
        y: -DOCK_ITEM_BOUNCE_HEIGHT,
        duration: DOCK_ITEM_BOUNCE_HALF_DURATION,
        ease: "power2.out",
        repeat: DOCK_ITEM_BOUNCE_COUNT * 2 - 1,
        yoyo: true,
        onComplete: () => gsap.set("button", { clearProps: true }),
      });
    },
    { scope: scopeRef, dependencies: [mounted, running, isReducedMotion] },
  );

  useGSAP(
    () => {
      const scope = scopeRef.current;
      if (!scope) return;

      if (instance.completed) {
        interruptRef.current = true;
        gsap.fromTo(
          scope,
          { maxWidth: scope.offsetWidth },
          {
            maxWidth: 0,
            marginRight: -DOCK_ITEM_GAP,
            opacity: 0,
            duration: isReducedMotion ? 0 : DOCK_ITEM_EXIT_DURATION,
            ease: "power2.inOut",
            overwrite: "auto",
            onComplete: () => onComplete(instance.id),
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
          duration: isReducedMotion ? 0 : DOCK_ITEM_ENTER_DURATION,
          ease: "power3.out",
          overwrite: "auto",
          clearProps: true,
        });
      }
    },
    {
      scope: scopeRef,
      dependencies: [instance.completed, instance.id, onComplete, isReducedMotion],
    },
  );

  const onRegisterRef = useCallback(
    (node: HTMLElement | null) => {
      scopeRef.current = node;
      const unregister = onRegisterRefProp(instance.id)(node);

      return () => {
        scopeRef.current = null;
        unregister();
      };
    },
    [instance.id, onRegisterRefProp],
  );

  const onOpenChange = useCallback(
    (event: MouseEvent<HTMLButtonElement>) => {
      event.preventDefault();

      if (!instance.pid) {
        open(instance.id);
        return;
      }

      if (instance.singleton && instance.focused && !instance.minimized) {
        minimize(instance.pid, true);
        return;
      }
      if (instance.minimized) {
        minimize(instance.pid, false);
      }

      focus(instance.pid);
    },
    [instance.pid, instance.singleton, instance.focused, instance.minimized, instance.id],
  );

  return (
    <DockPrimitive.Item data-slot="dock-item" ref={onRegisterRef} {...DockDOM.assign(instance.id)}>
      <DockPrimitive.Button onClick={onOpenChange}>
        <span>{instance.title.slice(0, 1)}</span>
        <Activity mode={instance.count > 1 ? "visible" : "hidden"}>
          <span className="bg-destructive/80 text-primary-foreground border-destructive absolute -top-1 -right-1 flex size-3 items-center justify-center rounded-full border text-[8px] font-medium">
            {instance.count}
          </span>
        </Activity>
      </DockPrimitive.Button>
      <Activity mode={running ? "visible" : "hidden"}>
        <DockPrimitive.Badge
          variant={instance.focused ? "focused" : !instance.minimized ? "running" : "default"}
        />
      </Activity>
    </DockPrimitive.Item>
  );
}
