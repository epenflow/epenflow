"use client";
import React from "react";
import { cva, VariantProps } from "class-variance-authority";
import { cn, useTerminal } from "@/components/base/terminal/helpers";

const terminalContentVariants = cva("terminal-content", {
	variants: {
		variant: {
			default: "terminal-content-default",
			minimize: "terminal-content-minimize",
			maximize: "terminal-content-maximize",
		},
	},
	defaultVariants: {
		variant: "default",
	},
});

type TerminalContentVariants = typeof terminalContentVariants;
interface TerminalContentProps
	extends React.ComponentPropsWithoutRef<"div">,
		VariantProps<TerminalContentVariants> {}

export const TerminalContent = React.forwardRef<
	HTMLDivElement,
	TerminalContentProps
>(({ className, variant, ...rest }, ref) => {
	const randomId = React.useId();
	const id = `terminal-content-${randomId}`;
	const { isTrigger } = useTerminal();

	return (
		<div
			{...{
				...rest,
				ref,
				id,
				className: cn(
					terminalContentVariants({
						variant: isTrigger.minimize ? "minimize" : "default",
						className,
					}),
				),
			}}
		/>
	);
});
TerminalContent.displayName = "TerminalContent";
