"use client";
import { WindowModule } from "@/components/base/window/window.module";
import { useIsomorphicLayoutEffect } from "@/hooks";
import React from "react";

export interface BaseWindowProps {
	containerRef: React.RefObject<HTMLCanvasElement>;
}

export function WindowHOC<T extends object>(
	BaseWindow: React.ComponentType<T & BaseWindowProps>,
) {
	function Window(props: T) {
		const containerRef = React.useRef<HTMLCanvasElement | null>(null);

		useIsomorphicLayoutEffect(() => {
			if (containerRef.current) {
				new WindowModule(containerRef.current);
			}
		}, []);

		return <BaseWindow {...{ ...props, containerRef }} />;
	}
	return Window;
}
