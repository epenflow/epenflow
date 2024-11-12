"use client";
import React from "react";
import {
	TerminalHOCProps,
	TerminalProps,
	useTerminal,
	useTerminalZIndex,
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
		const { activeZIndex, handleClick } = useTerminalZIndex();
		const draggableRef = React.useRef<Array<Draggable>>();
		const [dragPosition, setDragPosition] = React.useState<{
			x: number;
			y: number;
		}>({ x: props.position?.x ?? 0, y: props.position?.y ?? 0 });

		const newActiveZIndex = activeZIndex.findIndex(
			(prevIndex) => prevIndex === props.index,
		);

		const zIndex =
			newActiveZIndex > 0
				? newActiveZIndex * (props.multiplyZIndex ?? 100)
				: (props.defaultZIndex ?? 50);

		function triggerZIndex() {
			handleClick(props.index);
		}

		function initializeDraggable() {
			draggableRef.current = Draggable.create(containerRef.current, {
				type: "x,y",
				edgeResistance: 1,
				bounds: document.body,
				inertia: true,
			});
		}

		React.useEffect(() => {
			if (containerRef.current) {
				const ctx = gsap.context(() => {
					initializeDraggable();
				}, containerRef);
				return () => ctx.revert();
			}
		}, [containerRef, isTrigger.minimize]);

		React.useEffect(() => {
			if (draggableRef.current && draggableRef.current[0]) {
				if (isTrigger.maximize) {
					draggableRef.current[0].disable();
					const x = draggableRef.current[0].x;
					const y = draggableRef.current[0].y;
					setDragPosition({ x, y });
				} else {
					draggableRef.current[0].enable();
				}
			}
			if (isTrigger.maximize) {
				gsap.to(containerRef.current, {
					top: 0,
					left: 0,
					x: 0,
					y: 0,
					ease: "power4.inOut",
					duration: 0.5,
				});
			} else {
				gsap.to(containerRef.current, {
					x: dragPosition.x,
					y: dragPosition.y,
					duration: 0.5,
					ease: "power4.inOut",
				});
			}
		}, [isTrigger.maximize, containerRef, draggableRef, setDragPosition]);

		return (
			<BaseComponent
				{...{ ...props, containerRef, zIndex, triggerZIndex }}
			/>
		);
	};

	return (props: T) => {
		return (
			<TerminalProvider>
				<Terminal {...props} />
			</TerminalProvider>
		);
	};
}
