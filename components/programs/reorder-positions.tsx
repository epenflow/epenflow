'use client';
import { useZIndex } from '@/lib/hooks/get-active-index';
import React from 'react';
interface ReorderPositionsProps {
	initialId: number;
	initialZIndex: number;
	children: React.ReactNode;
	label: string;
}
export const ReorderPositions: React.FC<ReorderPositionsProps> = ({
	initialId,
	initialZIndex,
	children,
	label,
}) => {
	return <div id="reorder--component">{children}</div>;
};
