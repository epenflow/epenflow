"use client";
import React from "react";

/**
 *
 * ----------------------------------------------------------
 * GSAP
 * ----------------------------------------------------------
 *
 */
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { Draggable } from "gsap/Draggable";
import {
	Action,
	TerminalProvider,
	useTerminal,
} from "@/components/base/terminal/helpers";

gsap.registerPlugin(useGSAP, Draggable);

export interface BaseTerminalProps
	extends React.ComponentPropsWithoutRef<"div"> {
	containerRef: React.RefObject<HTMLDivElement>;
	header?: React.ReactNode | undefined;
}

interface TerminalHOCProps extends React.ComponentPropsWithoutRef<"div"> {
	header?: React.ReactNode | undefined;
	container?: string | undefined;
}

export function TerminalHOC<T extends object & TerminalHOCProps>(
	BaseTerminal: React.ComponentType<T & BaseTerminalProps>,
) {
	function Terminal(props: T) {
		const containerRef = React.useRef<HTMLDivElement | null>(null);
		const draggableRef = React.useRef<Draggable[]>();
		const { isTrigger, draggableTriggerRef } = useTerminal();

		function draggable() {
			const container = document.getElementById(
				props.container || "desktop-container",
			);
			draggableRef.current = Draggable.create(containerRef.current, {
				bounds: container || window,
				trigger: draggableTriggerRef.current,
				dragClickables: false,
				zIndexBoost: true,
				allowNativeTouchScrolling: false,
				allowContextMenu: true,
			});
		}

		React.useEffect(() => {
			draggable();
			if (draggableRef.current) {
				const draggableInstance = draggableRef.current[0];
				if (isTrigger.maximize) {
					draggableInstance.disable();
					const MAXIMIZE_POSITION = { x: 0, y: 0 };
					gsap.set(containerRef.current, {
						...MAXIMIZE_POSITION,
					});
				}
			}
		}, [isTrigger]);

		return <BaseTerminal {...{ ...props, containerRef }} />;
	}

	return (props: T) => {
		return (
			<TerminalProvider>
				<Terminal {...props} />
			</TerminalProvider>
		);
	};
}
