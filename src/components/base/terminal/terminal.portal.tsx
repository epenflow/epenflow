"use client";
import React from "react";
import ReactDOM from "react-dom";
import { TerminalPortalProps } from "@/components/base/terminal/libs";

export const TerminalPortal: React.FC<TerminalPortalProps> = ({
	children,
	condition,
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
TerminalPortal.displayName = "TerminalPortal";
