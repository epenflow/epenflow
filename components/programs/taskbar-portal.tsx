'use client';
import React from 'react';
import ReactDOM from 'react-dom';
interface TaskbarPortalProps {
	children: React.ReactNode;
	condition: boolean;
}
export const TaskbarPortal: React.FC<TaskbarPortalProps> = ({
	children,
	condition,
}) => {
	const [mounted, setMounted] = React.useState<boolean>(false);
	React.useEffect(() => {
		setMounted(true);
	}, [mounted]);
	if (mounted) {
		const portalElement = document.querySelector(
			'#taskbar--programs',
		) as HTMLDivElement;
		return condition
			? ReactDOM.createPortal(children, portalElement)
			: children;
	}
};
