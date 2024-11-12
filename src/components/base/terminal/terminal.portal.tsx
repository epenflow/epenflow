"use client";
import React from "react";
import ReactDOM from "react-dom";
import { TerminalPortalProps } from "@/components/base/terminal/libs";

export const TerminalPortal: React.FC<TerminalPortalProps> = ({
	children,
	condition,
}) => {
	const container = document.getElementById("terminal-program");

	return condition
		? ReactDOM.createPortal(children, container as HTMLElement)
		: children;
};
TerminalPortal.displayName = "TerminalPortal";
