'use client';
import React from 'react';
import { ProgramsModal } from '@/components/programs/programs-modal';
import {
	DraggableWrapper,
	DragPositions,
	ProgramsWrapperProps,
} from '@/components/programs/draggable-wrapper';
import {
	TerminalCard,
	TerminalContent,
	TerminalHeader,
	TerminalTitle,
	TerminalTrigger,
} from '@/components/programs/terminal';
import { useDraggable } from '@/lib/hooks/use-draggable';
import { useVariants } from '@/lib/hooks/use-variants';
import { useProgramTrigger } from '@/lib/hooks/use-program-trigger';
import { DraggableProps } from 'react-draggable';
import { TaskbarPortal } from '@/components/programs/taskbar-portal';

interface TerminalProps extends ProgramsWrapperProps {}
export const Terminal: React.FC<TerminalProps> = ({
	position = DragPositions,
	label,
}) => {
	const { fnClose, fnMaximize, fnMinimize, isClose, isMaximize, isMinimize } =
		useProgramTrigger();

	const { nodeRef, draggableDisabled, draggablePositions, handleStop } =
		useDraggable({
			isMaximize,
			isMinimize,
			position,
		});
	const {
		cardVariants,
		contentVariants,
		modalVariants,
		headerVariants,
		triggerVariants,
	} = useVariants(isMinimize, isMaximize);
	const triggerValues = {
		fnClose,
		fnMaximize,
		fnMinimize,
		isFullscreen: isMinimize,
		variant: triggerVariants,
	};
	const draggableValues: Partial<DraggableProps> = {
		nodeRef: nodeRef,
		cancel: '.terminal-cancel',
		positionOffset: {
			x: 0,
			y: 0,
		},
		position: draggablePositions,
		disabled: draggableDisabled,
		allowAnyClick: true,
		defaultClassName: isMinimize ? 'relative' : 'fixed',
		defaultClassNameDragging: 'z-50 fixed',
		defaultClassNameDragged: isMinimize ? 'relative' : 'fixed',
		onStop: handleStop,
	};
	return (
		<TaskbarPortal condition={isMinimize}>
			<DraggableWrapper {...draggableValues}>
				<ProgramsModal variant={modalVariants}>
					<TerminalCard variant={cardVariants}>
						<TerminalHeader variant={headerVariants}>
							<TerminalTrigger {...triggerValues} />
							<TerminalTitle ref={nodeRef}>
								<span>test</span>
							</TerminalTitle>
						</TerminalHeader>
						<TerminalContent
							variant={contentVariants}
						></TerminalContent>
					</TerminalCard>
				</ProgramsModal>
			</DraggableWrapper>
		</TaskbarPortal>
	);
};
