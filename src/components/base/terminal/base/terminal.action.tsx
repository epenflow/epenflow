"use client";
import React from "react";
import { TerminalButton } from "@/components/base/terminal/base/terminal.button";
import {
	Close,
	Maximize,
	Minimize,
} from "@/components/base/terminal/base/terminal.icon";
import { cn } from "@/utils";
import { cva, VariantProps } from "class-variance-authority";
import { useTerminal } from "@/components/base/terminal/helpers";
import { is } from "date-fns/locale";

const terminalButtonActionVariants = cva("terminal-action", {
	variants: {
		variant: {
			default: "absolute",
			minimize: "relative",
		},
	},
	defaultVariants: {
		variant: "default",
	},
});

type TerminalButtonActionVariants = typeof terminalButtonActionVariants;
interface TerminalActionProps
	extends React.ComponentPropsWithoutRef<"div">,
		VariantProps<TerminalButtonActionVariants> {}

export const TerminalAction = React.forwardRef<
	HTMLDivElement,
	TerminalActionProps
>(({ className, variant, ...rest }, ref) => {
	const randomId = React.useId();
	const id = `terminal-actions-${randomId}`;
	const viewBox = `0 0 10 10`;
	const { setTrigger, isTrigger } = useTerminal();

	return (
		<div
			{...{
				...rest,
				ref,
				id,
				className: cn(
					terminalButtonActionVariants({
						variant: isTrigger.minimize ? "minimize" : "default",
						className,
					}),
				),
			}}>
			<TerminalButton
				{...{
					variant: "close",
					onClick: () => {
						setTrigger("CLOSE");
					},
				}}>
				<Close {...{ viewBox, className: "terminal-icon" }} />
			</TerminalButton>
			<TerminalButton
				{...{
					variant: "minimize",
					disabled: isTrigger.minimize,
					onClick: () => {
						setTrigger("MINIMIZE");
					},
				}}>
				<Minimize {...{ viewBox, className: "terminal-icon" }} />
			</TerminalButton>
			<TerminalButton
				{...{
					variant: "maximize",
					onClick: () => {
						setTrigger("MAXIMIZE");
					},
				}}>
				<Maximize {...{ viewBox, className: "terminal-icon" }} />
			</TerminalButton>
		</div>
	);
});
TerminalAction.displayName = "TerminalAction";
