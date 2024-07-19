'use client';
import { Caution } from '@/components/caution';
import { TerminalModal } from '@/components/terminal/terminal-modal';
import { TerminalPortal } from '@/components/terminal/terminal-portal';
import { WindowCard } from '@/components/window/window-card';
import { WindowContent } from '@/components/window/window-content';
import { WindowHeader } from '@/components/window/window-header';
import { WindowTitle } from '@/components/window/window-title';
import { WindowTrigger } from '@/components/window/window-trigger';
import { cn } from '@/lib/utils';
import React from 'react';
import Draggable, { DraggableData, DraggableEvent } from 'react-draggable';
const DragPosition = {
	x: 0,
	y: 0,
} satisfies Record<string, number>;
interface WindowProps extends React.HTMLAttributes<HTMLDivElement> {
	position?: typeof DragPosition;
	label?: string;
}
export const Window: React.FC<WindowProps> = ({
	position = {
		x: 0,
		y: 0,
	},
	label,
	children,
	className,
}) => {
	const nodeRef = React.useRef<React.ElementRef<'h1'>>(null);
	/**
	 *
	 */
	const [isMinimize, setMinimize] = React.useState<boolean>(false);
	const [isMaximize, setMaximize] = React.useState<boolean>(false);
	const [dragPosition, setDragPosition] =
		React.useState<typeof DragPosition>(position);
	/**
	 *
	 */
	function fnClose() {
		console.log('close');
	}
	function fnMinimize() {
		if (isMaximize) {
			setMaximize((prev) => !prev);
		}
		setMinimize((prev) => !prev);
	}
	function fnMaximize() {
		if (isMinimize) {
			return setMinimize((prev) => !prev);
		}
		setMaximize((prev) => !prev);
	}
	/**
	 *
	 */
	function handleStop(event: DraggableEvent, data: DraggableData) {
		setDragPosition({ x: data.lastX, y: data.lastY });
	}
	const draggablePositions = {
		x: isMaximize || isMinimize ? 0 : dragPosition.x,
		y: isMaximize || isMinimize ? 0 : dragPosition.y,
	};
	const draggableDisabled = isMaximize || isMinimize;
	const card = isMinimize ? 'minimize' : isMaximize ? 'maximize' : 'default';
	const offsetParent =
		typeof document !== 'undefined' ? document.body : undefined;
	return (
		<TerminalPortal condition={isMinimize}>
			<Draggable
				nodeRef={nodeRef}
				cancel=".window-cancel"
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
					className="z-50 bg-[#ff0000]"
				>
					<WindowCard variant={card}>
						<WindowHeader>
							<WindowTitle
								className="window-handler"
								ref={nodeRef}
							>
								<span>{label}</span>
							</WindowTitle>
							<WindowTrigger
								disabledMinimize={isMinimize}
								fnClose={fnClose}
								fnMaximize={fnMaximize}
								fnMinimize={fnMinimize}
							/>
						</WindowHeader>
						<WindowContent
							variant={isMinimize ? 'minimize' : 'default'}
							className={cn('window-cancel flex-col', className)}
						>
							{children}
						</WindowContent>
					</WindowCard>
				</TerminalModal>
			</Draggable>
		</TerminalPortal>
	);
};
