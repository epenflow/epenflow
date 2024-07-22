'use client';

import React from 'react';
import { TaskbarPortal } from '../../components/programs/taskbar-portal';
import {
	DraggableWrapper,
	DragPositions,
	ProgramsWrapperProps,
} from '@/components/programs/draggable-wrapper';
import { ProgramsModal } from '@/components/programs/programs-modal';
import {
	WindowCard,
	WindowContent,
	WindowHeader,
	WindowTitle,
	WindowTrigger,
} from '@/components/programs/window';
import { useDraggable } from '@/components/programs/hooks/use-draggable';
import { useVariants } from '@/components/programs/hooks/use-variants';
import { useProgramTrigger } from '@/components/programs/hooks/use-program-trigger';
import { DraggableProps } from 'react-draggable';
import { cn } from '@/lib/utils';

interface WindowProps extends ProgramsWrapperProps {}
export const Window: React.FC<WindowProps> = ({
	position = DragPositions,
	label,
	children,
	className,
}) => {
	const { fnClose, fnMaximize, fnMinimize, isClose, isMaximize, isMinimize } =
		useProgramTrigger();

	const { nodeRef, draggableDisabled, draggablePositions, handleStop } =
		useDraggable({
			isMaximize,
			isMinimize,
			position,
		});
	const { cardVariants, contentVariants, modalVariants } = useVariants(
		isMinimize,
		isMaximize,
	);
	const triggerValues = {
		fnClose,
		fnMaximize,
		fnMinimize,
		disabledMinimize: isMinimize,
	};
	const draggableValues: Partial<DraggableProps> = {
		nodeRef: nodeRef,
		cancel: '.window-cancel',
		positionOffset: {
			x: 0,
			y: 0,
		},
		position: draggablePositions,
		disabled: draggableDisabled,
		allowAnyClick: true,
		defaultClassName: isMinimize ? 'relative' : 'fixed',
		defaultClassNameDragging: 'fixed',
		defaultClassNameDragged: isMinimize ? 'relative' : 'fixed',
		onStop: handleStop,
	};
	return (
		<TaskbarPortal condition={isMinimize}>
			<DraggableWrapper {...draggableValues}>
				<ProgramsModal
					variant={modalVariants}
					className={cn(!isMinimize && 'bg-[#f00]')}
				>
					<WindowCard variant={cardVariants}>
						<WindowHeader>
							<WindowTitle ref={nodeRef}>
								<span>{label}</span>
							</WindowTitle>
							<WindowTrigger {...triggerValues} />
						</WindowHeader>
						<WindowContent
							variant={contentVariants}
							className={className}
						>
							{children}
						</WindowContent>
					</WindowCard>
				</ProgramsModal>
			</DraggableWrapper>
		</TaskbarPortal>
	);
};
