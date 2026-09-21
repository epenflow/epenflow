import { useEffect, useRef, useState } from "react";

import { mergeProps, useRender } from "@base-ui/react";
import { cn } from "#/lib/utils.ts";
import { gsap, useGSAP } from "#/lib/gsap.ts";

interface NetworkInformation extends EventTarget {
  effectiveType?: "slow-2g" | "2g" | "3g" | "4g";
  saveData?: boolean;
  downlink?: number;
  rtt?: number;
  addEventListener(type: string, listener: EventListenerOrEventListenerObject): void;
  removeEventListener(type: string, listener: EventListenerOrEventListenerObject): void;
}

interface NavigatorWithConnection extends Navigator {
  connection?: NetworkInformation;
}

export type WifiStrength = 0 | 1 | 2 | 3;

export interface NetworkSnapshot {
  online: boolean;
  effectiveType?: NetworkInformation["effectiveType"];
  strength: WifiStrength;
}

export interface UseNetworkOptions {
  onOnlineChange?(online: boolean): void;
  onStrengthChange?(strength: WifiStrength): void;
  onNetworkChange?(snapshot: NetworkSnapshot): void;
}

function computeNetworkStrength(online: boolean, connection?: NetworkInformation): WifiStrength {
  if (!online) return 0;
  if (!connection) return 3;

  switch (connection.effectiveType) {
    case "slow-2g":
    case "2g":
      return 1;
    case "3g":
      return 2;
    case "4g":
    default:
      return 3;
  }
}

function useNetwork(options: UseNetworkOptions = {}) {
  const connection = (navigator as NavigatorWithConnection).connection;

  const [snapshot, setSnapshot] = useState<NetworkSnapshot>(() => ({
    online: navigator.onLine,
    effectiveType: connection?.effectiveType,
    strength: computeNetworkStrength(navigator.onLine, connection),
  }));

  const snapshotRef = useRef<NetworkSnapshot>(snapshot);
  const optionsRef = useRef<UseNetworkOptions>(options);

  useEffect(() => {
    optionsRef.current = options;
  });

  useEffect(() => {
    const update = () => {
      const online = navigator.onLine;

      const next: NetworkSnapshot = {
        online,
        effectiveType: connection?.effectiveType,
        strength: computeNetworkStrength(online, connection),
      };

      const previous = snapshotRef.current;
      snapshotRef.current = next;

      setSnapshot(next);

      if (previous.online !== next.online) {
        optionsRef.current.onOnlineChange?.(next.online);
      }
      if (previous.strength !== next.strength) {
        optionsRef.current.onStrengthChange?.(next.strength);
      }
      if (
        previous.online !== next.online ||
        previous.strength !== next.strength ||
        previous.effectiveType !== next.effectiveType
      ) {
        optionsRef.current.onNetworkChange?.(next);
      }
    };

    const controller = new AbortController();
    window.addEventListener("online", update, { signal: controller.signal });
    window.addEventListener("offline", update, { signal: controller.signal });
    connection?.addEventListener("change", update);

    return () => {
      controller.abort();
      connection?.removeEventListener("change", update);
    };
  }, [connection]);

  return snapshot;
}

function Wifi({
  render,
  onOnlineChange,
  onStrengthChange,
  onNetworkChange,
  ...props
}: useRender.ComponentProps<"svg"> & UseNetworkOptions) {
  const scopeRef = useRef<SVGSVGElement>(null);

  const { online, strength } = useNetwork({
    onOnlineChange,
    onStrengthChange,
    onNetworkChange,
  });

  // Animasi Inisialisasi (Mount)
  useGSAP(
    () => {
      gsap.fromTo(
        "[data-slot='dot'], [data-slot='inner'], [data-slot='outer']",
        { opacity: 0.2, scale: 0.8, transformOrigin: "bottom center" },
        { opacity: 1, scale: 1, duration: 0.6, stagger: 0.2, ease: "power1.inOut" },
      );
    },
    { scope: scopeRef },
  );

  useGSAP(
    () => {
      const tl = gsap.timeline({ defaults: { ease: "power2.inOut" } });

      if (!online) {
        tl.to("[data-slot='dot'], [data-slot='inner'], [data-slot='outer']", {
          opacity: 0.15,
          scale: 0.9,
          duration: 0.3,
        }).to(
          "[data-slot='slash']",
          {
            opacity: 1,
            strokeDashoffset: 0,
            duration: 0.4,
          },
          "-=0.2",
        );
        return;
      }

      tl.to("[data-slot='slash']", {
        opacity: 0,
        strokeDashoffset: 20,
        duration: 0.2,
      })
        .to(
          "[data-slot='dot']",
          {
            opacity: strength >= 1 ? 1 : 0.2,
            scale: 1,
            duration: 0.3,
          },
          0,
        )
        .to(
          "[data-slot='inner']",
          {
            opacity: strength >= 2 ? 1 : 0.2,
            scale: 1,
            duration: 0.3,
          },
          0,
        )
        .to(
          "[data-slot='outer']",
          {
            opacity: strength >= 3 ? 1 : 0.2,
            scale: 1,
            duration: 0.3,
          },
          0,
        );
    },
    { dependencies: [strength, online], scope: scopeRef },
  );

  return useRender({
    render,
    ref: scopeRef,
    defaultTagName: "svg",
    state: { online, strength },
    props: mergeProps<"svg">(
      {
        width: 14,
        height: 14,
        viewBox: "0 0 16 16",
        fill: "currentColor",
        "aria-hidden": true,
        suppressHydrationWarning: true,
        children: (
          <>
            <path data-slot="dot" d="M8 12.5a1.2 1.2 0 1 1 0-2.4 1.2 1.2 0 0 1 0 2.4Z" />
            <path data-slot="inner" d="M5 8.8a4.6 4.6 0 0 1 6 0l-1 1.1a3.1 3.1 0 0 0-4 0Z" />
            <path data-slot="outer" d="M2.6 6.3a8 8 0 0 1 10.8 0l-1 1.1a6.5 6.5 0 0 0-8.8 0Z" />

            <path
              data-slot="slash"
              d="M2 2 L14 14"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              fill="none"
              opacity="0"
              style={{
                strokeDasharray: 20,
                strokeDashoffset: 20,
              }}
            />
          </>
        ),
      },
      props,
    ),
  });
}
interface BatterySnapshot {
  level: number;
  charging: boolean;
  isSupported: boolean;
}

interface UseBatteryOptions {
  onLevelChange?(level: number): void;
  onChargingChange?(charging: boolean): void;
  onSupportChange?(isSupported: boolean): void;
  onBatteryChange?(snapshot: BatterySnapshot): void;
}

interface BatteryManager extends EventTarget {
  charging: boolean;
  chargingTime: number;
  dischargingTime: number;
  level: number;
  addEventListener(type: string, listener: EventListenerOrEventListenerObject): void;
  removeEventListener(type: string, listener: EventListenerOrEventListenerObject): void;
}

interface NavigatorWithBattery extends Navigator {
  getBattery?: () => Promise<BatteryManager>;
}

function useBattery(options: UseBatteryOptions = {}) {
  const [snapshot, setSnapshot] = useState<BatterySnapshot>({
    level: 100,
    charging: false,
    isSupported: true,
  });

  useEffect(() => {
    options.onLevelChange?.(snapshot.level);
    // oxlint-disable-next-line react-hooks/exhaustive-deps
  }, [snapshot.level]);

  useEffect(() => {
    options.onChargingChange?.(snapshot.charging);
    // oxlint-disable-next-line react-hooks/exhaustive-deps
  }, [snapshot.charging]);

  useEffect(() => {
    options.onBatteryChange?.(snapshot);
    // oxlint-disable-next-line react-hooks/exhaustive-deps
  }, [snapshot]);

  useEffect(() => {
    let batteryInstance: BatteryManager | null = null;
    let isActive = true;

    const update = () => {
      if (!batteryInstance) return;

      const next = {
        level: Math.round(batteryInstance.level * 100),
        charging: batteryInstance.charging,
        isSupported: true,
      };

      setSnapshot(next);
    };

    const init = async () => {
      const navigatorWithBattery = navigator as NavigatorWithBattery;
      if (!navigatorWithBattery.getBattery) {
        setSnapshot((prev) => ({ ...prev, isSupported: false }));
        options.onSupportChange?.(false);
        return;
      }

      try {
        const battery = await navigatorWithBattery.getBattery();
        if (!isActive) return;

        batteryInstance = battery;
        update();

        battery.addEventListener("levelchange", update);
        battery.addEventListener("chargingchange", update);
      } catch {
        setSnapshot((prev) => ({ ...prev, isSupported: false }));
        options.onSupportChange?.(false);
      }
    };

    init();

    return () => {
      isActive = false;
      if (batteryInstance) {
        batteryInstance.removeEventListener("levelchange", update);
        batteryInstance.removeEventListener("chargingchange", update);
      }
    };
  }, [options]);

  return snapshot;
}

const MAC_YELLOW = "#FFCC00";
const MAC_GREEN = "#34C759";
const MAC_RED = "#FF3B30";

function Battery({
  showPercentage = true,
  render,
  className,
  onLevelChange,
  onChargingChange,
  onSupportChange,
  onBatteryChange,
  ...props
}: useRender.ComponentProps<"div"> &
  UseBatteryOptions & {
    showPercentage?: boolean;
  }) {
  const scopeRef = useRef<HTMLDivElement>(null);

  const { level, charging, isSupported } = useBattery({
    onBatteryChange,
    onChargingChange,
    onLevelChange,
    onSupportChange,
  });

  useGSAP(
    () => {
      const maxFillWidth = 21;
      const currentWidth = Math.max(1.5, (level / 100) * maxFillWidth);

      let fillColor = MAC_YELLOW;
      if (charging || level >= 90) fillColor = MAC_GREEN;
      else if (level <= 20) fillColor = MAC_RED;

      gsap.to("[data-slot='fill']", {
        width: currentWidth,
        fill: fillColor,
        duration: 0.6,
        ease: "power3.out",
      });

      gsap.to("[data-slot='lightning']", {
        opacity: charging ? 1 : 0,
        visibility: charging ? "visible" : "hidden",
        duration: 0.3,
        ease: "power2.inOut",
      });
    },
    { dependencies: [level, charging], scope: scopeRef },
  );

  return useRender({
    render,
    ref: scopeRef,
    defaultTagName: "div",
    state: { level, charging, isSupported },
    props: mergeProps<"div">(
      {
        role: "status",
        "aria-live": "polite",
        suppressHydrationWarning: true,
        "aria-label": `Battery level is ${level}%, ${charging ? "charging" : "not charging"}`,
        className: cn("inline-flex items-center gap-1", className),
        children: (
          <>
            {showPercentage && (
              <span aria-hidden="true" className="text-xs font-medium tracking-tight tabular-nums">
                {level}%
              </span>
            )}

            <svg width="27" height="13" viewBox="0 0 27 13" aria-hidden="true">
              <defs>
                <mask id="stable-lightning-mask">
                  <rect width="27" height="13" fill="white" />
                  <path
                    data-slot="lightning"
                    d="M13.5,2.5 L10.5,7 L13,7 L12.5,10.5 L16,5.5 L13.5,5.5 Z"
                    fill="black"
                    className="invisible"
                  />
                </mask>
              </defs>
              <rect
                x="0.5"
                y="1"
                width="23"
                height="11"
                rx="2.5"
                fill="none"
                stroke="black"
                strokeWidth="1"
                opacity="0.4"
              />
              <path d="M24,4.5 Q26,4.5 26,6.5 Q26,8.5 24,8.5 Z" fill="black" opacity="0.4" />
              <rect
                data-slot="fill"
                x="1.5"
                y="2"
                width="21"
                height="9"
                rx="1.5"
                fill={MAC_YELLOW}
                mask="url(#stable-lightning-mask)"
              />
            </svg>
          </>
        ),
      },
      props,
    ),
  });
}

export const Indicator = {
  Wifi,
  Battery,
};
