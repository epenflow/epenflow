'use client';
import { __visitors } from '@/app/__components__/__constants__';
import { TerminalCard } from '@/components/terminal/terminal-card';
import { TerminalContent } from '@/components/terminal/terminal-content';
import { TerminalHeader } from '@/components/terminal/terminal-header';
import { TerminalTitle } from '@/components/terminal/terminal-title';
import { TerminalTrigger } from '@/components/terminal/terminal-trigger';
import { __iconStyle__ } from '@/components/terminal/icon';
import React from 'react';
import Draggable, { DraggableData, DraggableEvent } from 'react-draggable';
import { TerminalModal } from '@/components/terminal/terminal-modal';
import { TerminalPortal } from '@/components/terminal/terminal-portal';
import { cn } from '@/lib/utils';
/**
 * Default values and types for DragPosition
 */
const DragPosition = {
	x: 0,
	y: 0,
} satisfies Record<string, number>;
interface TerminalProps extends React.HTMLAttributes<HTMLDivElement> {
	label?: string;
	position?: typeof DragPosition;
}
export const Terminal: React.FC<TerminalProps> = ({
	children,
	label,
	position = {
		x: 0,
		y: 0,
	},
	className,
}) => {
	/**
	 * useRef
	 */
	const nodeRef = React.useRef<HTMLHeadingElement>(null);
	/**
	 * useState
	 */
	const [dragPosition, setDragPosition] =
		React.useState<typeof DragPosition>(position);
	const [isMaximize, setMaximize] = React.useState<boolean>(false);
	const [isMinimize, setMinimize] = React.useState<boolean>(false);
	/**
	 *
	 * handleStop
	 */
	const handleStop = React.useCallback(
		(event: DraggableEvent, data: DraggableData) => {
			setDragPosition({
				x: data.lastX,
				y: data.lastY,
			});
		},
		[setDragPosition],
	);

	/**
	 * trigger button
	 */
	function fnMaximize() {
		if (isMinimize) {
			return setMinimize((prev) => !prev);
		}
		setMaximize((prev) => !prev);
	}
	function fnMinimize() {
		if (isMaximize) {
			setMaximize((prev) => !prev);
		}
		setMinimize((prev) => !prev);
	}
	const terminalCardState = isMaximize
		? 'maximize'
		: isMinimize
			? 'minimize'
			: 'default';
	const draggablePositions = {
		x: isMaximize || isMinimize ? 0 : dragPosition.x,
		y: isMaximize || isMinimize ? 0 : dragPosition.y,
	};
	const draggableDisabled = isMaximize || isMinimize;
	const offsetParent =
		typeof document !== 'undefined' ? document.body : undefined;
	///components
	return (
		<TerminalPortal condition={isMinimize}>
			<Draggable
				nodeRef={nodeRef}
				cancel=".terminal-cancel"
				offsetParent={offsetParent}
				positionOffset={{ x: 0, y: 0 }}
				disabled={draggableDisabled}
				position={draggablePositions}
				allowAnyClick={true}
				defaultClassName={`${isMinimize ? 'relative' : 'fixed'}`}
				defaultClassNameDragging="z-50 relative"
				defaultClassNameDragged={`${isMinimize ? 'relative' : 'fixed'}`}
				onStop={handleStop}
			>
				<TerminalModal
					variant={isMaximize ? 'maximize' : 'default'}
					className={`z-30 bg-[#00ff0d]`}
				>
					<TerminalCard variant={terminalCardState}>
						<TerminalHeader
							variant={isMinimize ? 'minimize' : 'default'}
						>
							<TerminalTrigger
								fnMaximize={fnMaximize}
								fnMinimize={fnMinimize}
								variant={isMinimize ? 'minimize' : 'default'}
								isFullscreen={isMaximize}
							/>
							<TerminalTitle ref={nodeRef}>
								<span>{label}</span>
							</TerminalTitle>
						</TerminalHeader>
						<TerminalContent
							variant={isMinimize ? 'minimize' : 'default'}
							className={cn('terminal-cancel', className)}
						>
							{children}
						</TerminalContent>
					</TerminalCard>
				</TerminalModal>
			</Draggable>
		</TerminalPortal>
	);
};
