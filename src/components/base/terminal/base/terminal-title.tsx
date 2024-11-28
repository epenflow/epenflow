"use client";
import React from "react";
import { cn } from "@/components/base/terminal/helpers";

export const TerminalTitle = React.forwardRef<
	HTMLDivElement,
	React.ComponentPropsWithoutRef<"div">
>(({ className, ...rest }, ref) => {
	const randomId = React.useId();
	const id = `terminal-title-${randomId}`;

	return (
		<div
			{...{
				...rest,
				ref,
				id,
				className: cn("terminal-title", className),
			}}
		/>
	);
});
TerminalTitle.displayName = "TerminalTitle";
