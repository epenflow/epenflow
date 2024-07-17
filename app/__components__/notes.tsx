'use client';
import React from 'react';
import { TerminalCard } from '@/components/terminal/terminal-card';
import { TerminalContent } from '@/components/terminal/terminal-content';
import { TerminalHeader } from '@/components/terminal/terminal-header';
import { TerminalModal } from '@/components/terminal/terminal-modal';
import { TerminalTitle } from '@/components/terminal/terminal-title';
import { Rnd } from 'react-rnd';

export const Notes = () => {
	const [isFullscreen, setFullscreen] = React.useState<boolean>(false);
	const [isMinimize, setMinimize] = React.useState<boolean>(false);
	const [isClose, setClose] = React.useState<boolean>(false);
	const [isDrag, setDrag] = React.useState<boolean>(false);
	function handleFullscreen() {
		if (isMinimize) {
			setMinimize((prev) => !prev);
		}
		setFullscreen((prev) => !prev);
	}
	function handleMinimize() {
		setMinimize((prev) => !prev);
	}
	function handleClose() {
		setClose((prev) => !prev);
	}
	const defaultValues = {
		default: {
			width: isFullscreen ? '100%' : 'auto',
			height: isFullscreen ? '100%' : 'auto',
			y: isFullscreen ? 40 : 200,
			x: isFullscreen ? 40 : 50,
		},
	};
	return (
		<TerminalModal isFullscreen={isFullscreen} className="bg-[#00ff1e]">
			<Rnd
				disableDragging={isFullscreen}
				onDragStart={() => {
					setDrag(true);
				}}
				onDragStop={() => {
					setDrag(false);
				}}
				{...defaultValues}
				enableResizing={false}
				style={{
					position: isFullscreen ? 'relative' : 'absolute',
					zIndex: isDrag ? 100 : 1,
					opacity: isDrag ? 0.5 : 1,
				}}
			>
				<TerminalCard
					variant={
						isFullscreen
							? 'fullscreen'
							: isMinimize
								? 'minimize'
								: 'default'
					}
					isMinimize={isMinimize}
					isFullscreen={isFullscreen}
				>
					<TerminalHeader
						variant={isMinimize ? 'minimize' : 'default'}
						isFullscreen={isFullscreen}
						isMinimize={isMinimize}
						onFullscreen={handleFullscreen}
						onMinimize={handleMinimize}
						onClose={handleClose}
					>
						<TerminalTitle>__here//some//notes__</TerminalTitle>
					</TerminalHeader>
					<TerminalContent>
						<p className="text-lg font-bold">
							<span className="text-7xl">Hey</span>
							<span className="font-mono">
								,here is some notes. Im currently developing
								this website as solo dev.
							</span>
						</p>
					</TerminalContent>
				</TerminalCard>
			</Rnd>
		</TerminalModal>
	);
};
