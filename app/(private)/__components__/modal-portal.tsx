'use client';

import React from 'react';
import * as ReactDOM from 'react-dom';
interface ModalPortalProps {
	children: React.ReactNode;
	condition: boolean;
}
export const ModalPortal: React.FC<ModalPortalProps> = ({
	children,
	condition,
}) => {
	const [mounted, setMounted] = React.useState<boolean>(false);
	React.useEffect(() => {
		setMounted(true);
	}, []);
	if (mounted && typeof document !== 'undefined') {
		if (condition) return ReactDOM.createPortal(children, document.body);
	}
};
