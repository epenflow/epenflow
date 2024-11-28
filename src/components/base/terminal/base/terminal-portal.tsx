"use client";
import React from "react";
import ReactDOM from "react-dom";

interface TerminalPortalProps extends React.PropsWithChildren {
	condition: boolean;
}
export const TerminalPortal: React.FC<TerminalPortalProps> = ({
	condition,
	children,
}) => {
	const [isMounted, setMounted] = React.useState<boolean>(false);

	React.useEffect(() => {
		setMounted(true);
	}, []);

	if (isMounted) {
		const container = document.getElementById("terminal-program");
		if (condition && container) {
			return ReactDOM.createPortal(children, container);
		}
		return children;
	}
	return children;
};
