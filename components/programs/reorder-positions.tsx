'use client';
import { useZIndex } from '@/lib/hooks/use-z-index';
import React from 'react';
interface ReorderPositionsProps {
	id: number;
	children: React.ReactElement;
	label: string;
}
export const ReorderPositions: React.FC<ReorderPositionsProps> = ({
	id,
	children,
	label,
}) => {
	const { handleClick, activeZIndex } = useZIndex();
	const _activeZIndex = activeZIndex.findIndex((index) => index === id);
	const zIndex = _activeZIndex > 0 ? _activeZIndex * 100 : 50;

	function _handleClick() {
		handleClick(id);
	}

	return (
		<div
			id={`reorder--programs-${id}`}
			style={{
				zIndex,
				position: 'fixed',
			}}
			onMouseDown={_handleClick}
			onTouchStart={_handleClick}
		>
			{children}
		</div>
	);
};
