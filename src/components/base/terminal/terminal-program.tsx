"use client";
import React from "react";
import "./terminal.css";
import { cn } from "@/components/base/terminal/libs";

export const TerminalProgram = React.forwardRef<
	HTMLElement,
	React.ComponentPropsWithoutRef<"section">
>(({ className, ...rest }, ref) => {
	const ID = "terminal-program";

	return (
		<section
			{...{
				...rest,
				ref,
				id: ID,
				"aria-label": ID,
				className: cn("terminal-program", className),
			}}
		/>
	);
});

TerminalProgram.displayName = "TerminalProgram";
