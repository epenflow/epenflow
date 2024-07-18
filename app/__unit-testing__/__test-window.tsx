'use client';
import { Caution } from '@/components/caution';
import { TerminalModal } from '@/components/terminal/terminal-modal';
import { TerminalPortal } from '@/components/terminal/terminal-portal';
import { WindowCard } from '@/components/window/window-card';
import { WindowContent } from '@/components/window/window-content';
import { WindowHeader } from '@/components/window/window-header';
import { WindowTitle } from '@/components/window/window-title';
import { WindowTrigger } from '@/components/window/window-trigger';
import Image from 'next/image';
import React from 'react';
import Draggable, { DraggableData, DraggableEvent } from 'react-draggable';
const DragPosition = {
	x: 0,
	y: 0,
} satisfies Record<string, number>;
interface WindowProps {
	position?: typeof DragPosition;
}
export const __TestWindow: React.FC<WindowProps> = ({
	position = {
		x: 0,
		y: 0,
	},
}) => {
	const windowTitleRef = React.useRef<HTMLHeadingElement>(null);
	/**
	 *
	 */
	const [isMinimize, setMinimize] = React.useState<boolean>(false);
	const [isMaximize, setMaximize] = React.useState<boolean>(false);
	const [dragPosition, setDragPosition] =
		React.useState<typeof DragPosition>(DragPosition);
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
	return (
		<Draggable
			nodeRef={windowTitleRef}
			handle=".window-handler"
			cancel=".window-cancel"
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
				className="bg-[#ff0000]"
			>
				<TerminalPortal condition={isMinimize}>
					<WindowCard
						variant={
							isMinimize
								? 'minimize'
								: isMaximize
									? 'maximize'
									: 'default'
						}
					>
						<WindowHeader>
							<WindowTitle
								className="window-handler"
								ref={windowTitleRef}
							>
								<span>
									<q>__caution__</q>
								</span>
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
							className="window-cancel relative flex-col items-center justify-center"
						>
							<Caution />
							<div className="absolute -right-4 top-6 h-20 w-20 lg:top-24 lg:h-52 lg:w-52">
								<Image
									src="/palu.gif"
									width={0}
									height={0}
									sizes="100vw"
									style={{ width: '100%', height: 'auto' }}
									alt="palu"
								/>
							</div>
						</WindowContent>
					</WindowCard>
				</TerminalPortal>
			</TerminalModal>
		</Draggable>
	);
};
