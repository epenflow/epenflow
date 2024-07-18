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
	title,
	position = {
		x: 0,
		y: 0,
	},
}) => {
	/**
	 * useRef
	 */
	const terminalTitleRef = React.useRef<HTMLHeadingElement>(null);
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
	///components
	return (
		<Draggable
			nodeRef={terminalTitleRef}
			handle=".terminal-handler"
			cancel=".terminal-cancel"
			offsetParent={
				typeof document !== 'undefined' ? document.body : undefined
			}
			positionOffset={{ x: 0, y: 0 }}
			disabled={isMaximize || isMinimize}
			position={{
				x: isMaximize ? 0 : dragPosition.x,
				y: isMaximize ? 0 : dragPosition.y,
			}}
			allowAnyClick={true}
			defaultClassName="absolute"
			defaultClassNameDragging="z-50 relative"
			defaultClassNameDragged="absolute"
			onStop={handleStop}
		>
			<TerminalModal
				variant={isMaximize ? 'maximize' : 'default'}
				className={`bg-[#00ff0d]`}
			>
				<TerminalPortal condition={isMinimize}>
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
							<TerminalTitle ref={terminalTitleRef}>
								<span>{title}</span>
							</TerminalTitle>
						</TerminalHeader>
						<TerminalContent
							variant={isMinimize ? 'minimize' : 'default'}
							className="space-y-2.5 px-2.5 py-5 lg:space-y-5"
						>
							{children}
						</TerminalContent>
					</TerminalCard>
				</TerminalPortal>
			</TerminalModal>
		</Draggable>
	);
};
