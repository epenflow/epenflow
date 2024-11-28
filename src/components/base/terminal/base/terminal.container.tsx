"use client";
import React from "react";
import { cn, useTerminal } from "@/components/base/terminal/helpers";
import { cva, VariantProps } from "class-variance-authority";

const terminalContainerVariants = cva("terminal-container", {
	variants: {
		size: {
			default: "terminal-container-default",
			maximize: "terminal-container-maximize",
			minimize: "terminal-container-minimize",
		},
	},
	defaultVariants: {
		size: "default",
	},
});
type TerminalContainerVariants = typeof terminalContainerVariants;
interface TerminalContainerProps
	extends React.ComponentPropsWithoutRef<"div">,
		VariantProps<TerminalContainerVariants> {}

export const TerminalContainer = React.forwardRef<
	HTMLDivElement,
	TerminalContainerProps
>(({ className, size, ...rest }, ref) => {
	const randomId = React.useId();
	const id = `terminal-container-${randomId}`;
	const { isTrigger } = useTerminal();

	return (
		<div
			{...{
				...rest,
				ref,
				id,
				className: cn(
					terminalContainerVariants({
						size: isTrigger.maximize
							? "maximize"
							: isTrigger.minimize
								? "minimize"
								: "default",
						className,
					}),
				),
			}}
		/>
	);
});
TerminalContainer.displayName = "TerminalContainer";
