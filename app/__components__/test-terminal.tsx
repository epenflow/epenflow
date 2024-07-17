'use client';
import { __visitors } from '@/app/__components__/__constants__';
import { TerminalCard } from '@/components/terminal/terminal-card';
import { TerminalContent } from '@/components/terminal/terminal-content';
import { TerminalHeader } from '@/components/terminal/terminal-header';
import { TerminalTitle } from '@/components/terminal/terminal-title';
import { TerminalTrigger } from '@/components/terminal/terminal-trigger';
import { __iconStyle__ } from '@/components/terminal/icon';
import React from 'react';
import Draggable, {
	DraggableData,
	DraggableEvent,
	DraggableProps,
} from 'react-draggable';
import { TerminalModal } from '@/components/terminal/terminal-modal';
const DragPosition = {
	x: 0,
	y: 0,
} satisfies Record<string, number>;
export const TestTerminal = () => {
	/**
	 * useRef
	 */
	const terminalTitleRef = React.useRef<HTMLHeadingElement>(null);
	/**
	 * useState
	 */
	const [dragPosition, setDragPosition] =
		React.useState<typeof DragPosition>(DragPosition);
	const [isMaximize, setMaximize] = React.useState<boolean>(false);
	const [isMinimize, setMinimize] = React.useState<boolean>(false);
	/**
	 *
	 * fn Handler
	 */
	function handleStart(event: DraggableEvent, data: DraggableData) {
		// console.log('start');
		// console.log('start', { event: { event }, data: data });
	}
	function handleDrag(event: DraggableEvent, data: DraggableData) {
		// console.log('drag');
		// console.log('drag', { event: { event }, data: data });
	}
	const handleStop = React.useCallback(
		(event: DraggableEvent, data: DraggableData) => {
			// console.log('stop', { event: { event }, data: data });
			setDragPosition({
				x: data.lastX,
				y: data.lastY,
			});
		},
		[setDragPosition],
	);
	function handleMouseDown(event: MouseEvent) {
		// console.info('event', { event: event });
	}
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
	console.log({
		minimize: isMinimize,
		maximize: isMaximize,
	});
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
			offsetParent={document.body}
			positionOffset={{ x: 0, y: 0 }}
			disabled={isMaximize}
			position={{
				x: isMaximize ? 0 : dragPosition.x,
				y: isMaximize ? 0 : dragPosition.y,
			}}
			allowAnyClick={true}
			defaultClassNameDragging="z-50 relative"
			onDrag={handleDrag}
			onStart={handleStart}
			onStop={handleStop}
			onMouseDown={handleMouseDown}
		>
			<TerminalModal
				variant={isMaximize ? 'maximize' : 'default'}
				className={'bg-[#00ff0d]'}
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
						<TerminalTitle ref={terminalTitleRef}>
							<span>{__visitors.header}</span>
						</TerminalTitle>
					</TerminalHeader>
					<TerminalContent
						variant={isMinimize ? 'minimize' : 'default'}
					>
						<p className="py-10 text-justify text-xl">
							{__visitors.descriptions}
						</p>
					</TerminalContent>
				</TerminalCard>
			</TerminalModal>
		</Draggable>
	);
};
