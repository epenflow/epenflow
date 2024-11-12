import React from "react";
import {
	cn,
	TerminalModalProps,
	terminalModalVariants,
} from "@/components/base/terminal/libs";

export const TerminalModal = React.forwardRef<
	HTMLDivElement,
	TerminalModalProps
>(({ className, size, ...rest }, ref) => {
	const ID = "terminal-modal";

	return (
		<div
			{...{
				...rest,
				ref,
				id: ID,
				"aria-label": ID,
				className: cn(terminalModalVariants({ size, className })),
			}}
		/>
	);
});
TerminalModal.displayName = "TerminalModal";
