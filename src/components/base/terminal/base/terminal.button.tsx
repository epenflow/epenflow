import React from "react";
import {
	cn,
	TerminalButtonProps,
	terminalButtonVariants,
} from "@/components/base/terminal/libs";

export const TerminalButton = React.forwardRef<
	HTMLButtonElement,
	TerminalButtonProps
>(({ className, variant, ...rest }, ref) => {
	const LABEL = "terminal-button";
	const ID = React.useId();

	return (
		<button
			{...{
				...rest,
				id: ID,
				"aria-label": LABEL,
				className: cn(terminalButtonVariants({ variant, className })),
			}}
		/>
	);
});
TerminalButton.displayName = "TerminalButton";
