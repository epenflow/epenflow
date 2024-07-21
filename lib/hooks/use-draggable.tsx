'use client';
import React from 'react';
import { DraggableData, DraggableEvent } from 'react-draggable';
const DragPositions = {
	x: 0,
	y: 0,
} satisfies Record<string, number>;
interface DraggableProps {
	position: typeof DragPositions;
	isMinimize: boolean;
	isMaximize: boolean;
}
export function useDraggable({
	position,
	isMinimize,
	isMaximize,
}: DraggableProps) {
	const [dragPosition, setDragPosition] =
		React.useState<typeof DragPositions>(position);
	const nodeRef = React.useRef<React.ElementRef<'h1'>>(null);

	function handleStop(event: DraggableEvent, data: DraggableData) {
		setDragPosition({ x: data.lastX, y: data.lastY });
	}
	const draggablePositions: typeof DragPositions = {
		x: isMaximize || isMinimize ? 0 : dragPosition.x,
		y: isMaximize || isMinimize ? 0 : dragPosition.y,
	};
	const draggableDisabled = isMaximize || isMinimize;
	return {
		nodeRef,
		handleStop,
		draggablePositions,
		draggableDisabled,
	};
}
