import React from "react";
import {
	cn,
	TerminalCardProps,
	terminalCardVariants,
} from "@/components/base/terminal/libs";

export const TerminalCard = React.forwardRef<HTMLDivElement, TerminalCardProps>(
	({ className, size, ...rest }, ref) => {
		const ID = "terminal-card";

		return (
			<div
				{...{
					...rest,
					ref,
					id: ID,
					"aria-label": ID,
					className: cn(terminalCardVariants({ size, className })),
				}}
			/>
		);
	},
);
TerminalCard.displayName = "TerminalCard";
