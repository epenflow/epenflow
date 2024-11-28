"use client";
import React from "react";
import { cva, VariantProps } from "class-variance-authority";
import { cn } from "@/components/base/terminal/helpers";

const terminalButtonVariants = cva("terminal-button", {
	variants: {
		variant: {
			close: "button-variant-close",
			minimize: "button-variant-minimize",
			maximize: "button-variant-maximize",
		},
	},
	defaultVariants: {
		variant: "close",
	},
});

type TerminalButtonVariants = typeof terminalButtonVariants;
interface TerminalButtonProps
	extends React.ComponentPropsWithoutRef<"button">,
		VariantProps<TerminalButtonVariants> {}

export const TerminalButton = React.forwardRef<
	HTMLButtonElement,
	TerminalButtonProps
>(({ className, variant, ...rest }, ref) => {
	const randomId = React.useId();
	const id = `terminal-button-${randomId}`;

	return (
		<button
			{...{
				...rest,
				ref,
				id,
				className: cn(terminalButtonVariants({ variant, className })),
			}}
		/>
	);
});
TerminalButton.displayName = "TerminalButton";
