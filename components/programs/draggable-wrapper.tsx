'use client';
import React from 'react';
import Draggable, {
	DraggableData,
	DraggableEvent,
	DraggableProps,
} from 'react-draggable';

export const DragPositions = {
	x: 0,
	y: 0,
} satisfies Record<string, number>;

export interface ProgramsWrapperProps
	extends React.HTMLAttributes<HTMLDivElement> {
	position?: typeof DragPositions;
	label?: string;
}

export const DraggableWrapper: React.FC<Partial<DraggableProps>> = ({
	children,
	...rest
}) => {
	const offsetParent =
		typeof document !== 'undefined' ? document.body : undefined;
	return (
		<Draggable {...rest} offsetParent={offsetParent}>
			{children}
		</Draggable>
	);
};
