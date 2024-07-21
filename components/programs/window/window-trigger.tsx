import { WindowButton } from '@/components/programs/window/window-button';
import React from 'react';

interface WindowTriggerProps {
	fnClose?: () => void;
	fnMinimize?: () => void;
	fnMaximize?: () => void;
	disabledMinimize?: boolean;
}
export const WindowTrigger: React.FC<WindowTriggerProps> = ({
	fnClose,
	fnMaximize,
	fnMinimize,
	disabledMinimize = false,
}) => {
	return (
		<div id="window--trigger" className="flex gap-1">
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
