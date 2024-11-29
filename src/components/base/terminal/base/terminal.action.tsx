"use client";
import React from "react";
import { TerminalButton } from "@/components/base/terminal/base/terminal.button";
import {
	Close,
	IconProps,
	Maximize,
	Minimize,
} from "@/components/base/terminal/base/terminal.icon";
import { cn } from "@/utils";
import { cva, VariantProps } from "class-variance-authority";
import { Action, useTerminal } from "@/components/base/terminal/helpers";

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

type Event = React.MouseEvent<HTMLButtonElement, MouseEvent>;
type TerminalButtonActionVariants = typeof terminalButtonActionVariants;
type ActionList = Array<{
	variant?: "minimize" | "close" | "maximize" | null | undefined;
	Component: React.ForwardRefExoticComponent<
		IconProps & React.RefAttributes<SVGSVGElement>
	>;
	disabled?: boolean | ((isTrigger: boolean) => boolean) | undefined;
	handleClick?: (
		event: Event,
		setTrigger: React.Dispatch<Action>,
		callback?: () => React.Dispatch<Action>,
	) => void | undefined;
}>;
interface TerminalActionProps
	extends React.ComponentPropsWithoutRef<"div">,
		VariantProps<TerminalButtonActionVariants> {}

const ACTION_LIST: ActionList = [
	{
		variant: "close",
		Component: Close,
		disabled: true,
		handleClick(event, setTrigger) {
			event.preventDefault();
			setTrigger("CLOSE");
		},
	},
	{
		variant: "minimize",
		Component: Minimize,
		disabled: (isTrigger) => isTrigger,
		handleClick(event, setTrigger) {
			event.preventDefault();
			setTrigger("MINIMIZE");
		},
	},
	{
		variant: "maximize",
		Component: Maximize,
		disabled: false,
		handleClick(event, setTrigger) {
			event.preventDefault();
			setTrigger("MAXIMIZE");
		},
	},
];

/**
 * @todo - Improve the state actions
 */
export const TerminalAction = React.forwardRef<
	HTMLDivElement,
	TerminalActionProps
>(({ className, variant, ...rest }, ref) => {
	const randomId = React.useId();
	const id = `terminal-actions-${randomId}`;
	const viewBox = `0 0 10 10`;
	const { isTrigger, setTrigger } = useTerminal();

	const containerProps = {
		...rest,
		ref,
		id,
		className: cn(
			terminalButtonActionVariants({
				variant: isTrigger.minimize ? "minimize" : "default",
				className,
			}),
		),
	};

	return (
		<div {...containerProps}>
			{ACTION_LIST.map(
				({ Component, variant, disabled, handleClick }) => (
					<TerminalButton
						key={variant}
						{...{
							variant,
							onClick: (event: Event) =>
								handleClick?.(event, setTrigger),
							disabled:
								typeof disabled === "function"
									? disabled(isTrigger.minimize)
									: disabled,
						}}>
						<Component
							{...{ viewBox, className: "terminal-icon" }}
						/>
					</TerminalButton>
				),
			)}
		</div>
	);
});
TerminalAction.displayName = "TerminalAction";
