import React from "react";
import { TerminalLabelProps, cn } from "@/components/base/terminal/libs";

export const TerminalLabel = React.forwardRef<
	HTMLHeadingElement,
	TerminalLabelProps
>(({ className, ...rest }, ref) => {
	const ID = "terminal-label";

	return (
		<h1
			{...{
				...rest,
				ref,
				id: ID,
				"aria-label": ID,
				className: cn("terminal-label", className),
			}}
		/>
	);
});
TerminalLabel.displayName = "TerminalLabel";
