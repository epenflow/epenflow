"use client";
import React from "react";
import {
	cn,
	TerminalCardProps,
	terminalCardVariants,
	useTerminal,
} from "@/components/base/terminal/libs";

export const TerminalCard = React.forwardRef<HTMLDivElement, TerminalCardProps>(
	({ className, size, ...rest }, ref) => {
		const { isTrigger } = useTerminal();
		const ID = "terminal-card";
		console.log(isTrigger);

		return (
			<div
				{...{
					...rest,
					ref,
					id: ID,
					"aria-label": ID,
					className: cn(terminalCardVariants({ size, className })),
				}}
				data-minimize={isTrigger.minimize}
				data-maximize={isTrigger.maximize}
			/>
		);
	},
);
TerminalCard.displayName = "TerminalCard";
