import React from "react";
import {
	cn,
	TerminalContentProps,
	terminalContentVariants,
} from "@/components/base/terminal/libs";

export const TerminalContent = React.forwardRef<
	HTMLDivElement,
	TerminalContentProps
>(({ className, variant, ...rest }, ref) => {
	const ID = "terminal-content";

	return (
		<div
			{...{
				...rest,
				ref,
				id: ID,
				"aria-label": ID,
				className: cn(terminalContentVariants({ variant, className })),
				style: {
					height: `calc(100% - var(--terminal-header-height))`,
				},
			}}
		/>
	);
});
TerminalContent.displayName = "TerminalContent";
