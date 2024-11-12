import React from "react";
import {
	cn,
	TerminalHeaderProps,
	terminalHeaderVariants,
} from "@/components/base/terminal/libs";

export const TerminalHeader = React.forwardRef<
	HTMLDivElement,
	TerminalHeaderProps
>(({ className, variant, ...rest }, ref) => {
	const ID = "terminal-header";

	return (
		<div
			{...{
				...rest,
				ref,
				id: ID,
				"aria-label": ID,
				className: cn(terminalHeaderVariants({ variant, className })),
			}}
		/>
	);
});
TerminalHeader.displayName = "TerminalHeader";
