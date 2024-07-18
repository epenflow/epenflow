'use client';
import { WindowButton } from '@/components/window/window-button';
import React from 'react';

interface WindowTriggerProps extends React.HTMLAttributes<HTMLDivElement> {
	fnClose?: () => void;
	fnMinimize?: () => void;
	fnMaximize?: () => void;
	disabledMinimize?: boolean;
}
export const WindowTrigger: React.FC<WindowTriggerProps> = ({
	children,
	fnClose,
	fnMaximize,
	fnMinimize,
	disabledMinimize = false,
}) => {
	return (
		<div className="flex gap-1">
			<WindowButton
				disabled={disabledMinimize}
				onClick={fnMinimize}
				iconHref="/window--minimize.jpg"
			/>
			<WindowButton
				onClick={fnMaximize}
				iconHref="/window--maximize.jpg"
			/>
			<WindowButton onClick={fnClose} iconHref="/window--close.jpg" />
		</div>
	);
};
