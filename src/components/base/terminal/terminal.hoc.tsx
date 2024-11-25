"use client";
import React from "react";
import {
	TerminalHOCProps,
	TerminalProps,
	useTerminal,
} from "@/components/base/terminal/libs";
import { TerminalProvider } from "@/components/base/terminal/terminal.provider";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";

import { Flip } from "gsap/Flip";
import { Draggable } from "gsap/Draggable";

gsap.registerPlugin(useGSAP, Flip, Draggable);

export function TerminalHOC<T extends object & TerminalHOCProps>(
	BaseComponent: React.ComponentType<T & TerminalProps>,
) {
	BaseComponent.displayName = "BaseTerminal";

	const Terminal = (props: T) => {
		const containerRef = React.useRef<HTMLDivElement | null>(null);

		const { isTrigger } = useTerminal();
		const draggableRef = React.useRef<Array<Draggable>>();

		function initializeDraggable() {
			draggableRef.current = Draggable.create(containerRef.current, {
				bounds: window,
			});
		}

		useGSAP(
			() => {
				gsap.set(containerRef.current, {
					scale: 0,
					immediateRender: true,
				});
				gsap.to(containerRef.current, {
					scale: 1,
					duration: 0.5,
					ease: "power4",
				});

				initializeDraggable();
			},
			{ scope: containerRef, dependencies: [isTrigger] },
		);

		React.useEffect(() => {
			if (draggableRef.current && isTrigger.maximize) {
				draggableRef.current[0].disable();
				gsap.to(containerRef.current, {
					x: 0,
					y: 0,
				});
			}
		}, [isTrigger.maximize]);

		return <BaseComponent {...{ ...props, containerRef }} />;
	};

	return (props: T) => {
		return (
			<TerminalProvider>
				<Terminal {...props} />
			</TerminalProvider>
		);
	};
}
