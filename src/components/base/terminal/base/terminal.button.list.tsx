import React from "react";
import { TerminalButton } from "@/components/base/terminal/base/terminal.button";
import {
	Close,
	Maximize,
	Minimize,
} from "@/components/base/terminal/base/icon";
import {
	cn,
	TerminalButtonListProps,
	terminalButtonListVariants,
	useTerminal,
} from "@/components/base/terminal/libs";

export const TerminalButtonList = React.forwardRef<
	HTMLDivElement,
	TerminalButtonListProps
>(({ className, variant, ...rest }, ref) => {
	const ID = "terminal-button-list";
	const { isTrigger, trigger } = useTerminal();

	console.log(isTrigger);
	return (
		<div
			{...{
				...rest,
				...ref,
				id: ID,
				"aria-label": ID,
				className: cn(
					terminalButtonListVariants({ variant, className }),
				),
			}}>
			<TerminalButton onClick={() => trigger("CLOSE")} variant={"close"}>
				<Close />
			</TerminalButton>
			<TerminalButton
				disabled={variant === "minimize" ? true : false}
				onClick={() => trigger("MINIMIZE")}
				variant={"minimize"}>
				<Minimize />
			</TerminalButton>
			<TerminalButton
				onClick={() => trigger("MAXIMIZE")}
				variant={"maximize"}>
				<Maximize />
			</TerminalButton>
		</div>
	);
});
TerminalButtonList.displayName = "TerminalButtonList";
