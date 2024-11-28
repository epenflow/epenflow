"use client";
import React from "react";
import { cva, VariantProps } from "class-variance-authority";
import { cn, useTerminal } from "@/components/base/terminal/helpers";

const terminalHeaderVariants = cva("terminal-header", {
	variants: {
		variant: {
			default: "terminal-header-default",
			minimize: "terminal-header-minimize",
		},
	},
	defaultVariants: {
		variant: "default",
	},
});

type TerminalHeaderVariants = typeof terminalHeaderVariants;
interface TerminalHeaderProps
	extends React.ComponentPropsWithoutRef<"div">,
		VariantProps<TerminalHeaderVariants> {}

export const TerminalHeader = React.forwardRef<
	HTMLDivElement,
	TerminalHeaderProps
>(({ className, variant, ...rest }, ref) => {
	const randomId = React.useId();
	const id = `terminal-header-${randomId}`;
	const { isTrigger } = useTerminal();

	return (
		<div
			{...{
				...rest,
				ref,
				id,
				className: cn(
					terminalHeaderVariants({
						variant: isTrigger.minimize ? "minimize" : "default",
						className,
					}),
				),
			}}
		/>
	);
});
TerminalHeader.displayName = "TerminalHeader";
