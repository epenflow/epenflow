'use client';
import React from 'react';
import ReactDOM from 'react-dom';
interface TerminalPortal {
	children: React.ReactNode;
	condition: boolean;
}
export const TerminalPortal: React.FC<TerminalPortal> = ({
	children,
	condition,
}) => {
	const [mounted, setMounted] = React.useState<boolean>(false);
	React.useEffect(() => {
		setMounted(true);
	}, [mounted]);
	const portalElement = document.querySelector(
		'#terminal-portal',
	) as HTMLDivElement;
	return condition
		? mounted
			? ReactDOM.createPortal(children, portalElement)
			: null
		: children;
};
