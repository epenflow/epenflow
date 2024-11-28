"use client";
import React from "react";
import "../terminal.css";
import { cn } from "@/components/base/terminal/helpers";

export const TerminalProgram = React.forwardRef<
	HTMLDivElement,
	React.ComponentPropsWithoutRef<"div">
>(({ className, ...rest }, ref) => {
	const id = `terminal-program`;

	return (
		<div
			{...{
				...rest,
				ref,
				id,
				className: cn("terminal-program", className),
			}}
		/>
	);
});
TerminalProgram.displayName = "TerminalProgram";
