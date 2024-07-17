'use client';
import { TerminalCard } from '@/components/terminal/terminal-card';
import { TerminalContent } from '@/components/terminal/terminal-content';
import { TerminalHeader } from '@/components/terminal/terminal-header';
import { TerminalModal } from '@/components/terminal/terminal-modal';
import { TerminalTitle } from '@/components/terminal/terminal-title';
import React from 'react';
import { Rnd } from 'react-rnd';
export const DearVisitor = () => {
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
			y: isFullscreen ? 40 : 10,
			x: isFullscreen ? 40 : 50,
		},
	};
	return isClose ? null : (
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
						isMinimize={isMinimize}
						isFullscreen={isFullscreen}
						onFullscreen={handleFullscreen}
						onMinimize={handleMinimize}
						onClose={handleClose}
					>
						<TerminalTitle>Dear//Visitors</TerminalTitle>
					</TerminalHeader>
					<TerminalContent className="space-y-1 overflow-x-hidden font-sans text-lg font-medium">
						<h1 className="w-full text-end">Dear visitors,</h1>
						<p className="text-justify">
							{`>`}__root//@epenflow__:
						</p>
						<p className="text-justify">{}</p>
						<h1 className="flex w-full flex-col text-end">
							<span>Warm regards,</span>
							<span className="mb-10">Epen Flow©️22</span>
						</h1>
					</TerminalContent>
				</TerminalCard>
			</Rnd>
		</TerminalModal>
	);
};
