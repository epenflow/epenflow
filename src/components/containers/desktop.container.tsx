import { cn } from "@/utils";
import React from "react";

export const DesktopContainer = React.forwardRef<
	HTMLElement,
	React.ComponentPropsWithoutRef<"main">
>(({ className, ...rest }, ref) => {
	const id = `desktop-container`;

	return (
		<main
			{...{
				...rest,
				ref,
				id,
				className: cn(
					`h-[calc(100svh-var(--navbar-height))]`,
					className,
				),
			}}
		/>
	);
});
DesktopContainer.displayName = `DesktopContainer`;
