import React from "react";
import { cn } from "@/utils";
import { Navbar, TerminalProgram, Wallpaper } from "@/components/base";
import { DesktopContainer } from "@/components/containers";

export const DesktopLayout = React.forwardRef<
	HTMLElement,
	React.ComponentPropsWithoutRef<"main">
>(({ className, ...rest }, ref) => {
	return (
		<React.Fragment>
			<Navbar />
			<DesktopContainer {...{ ...rest, ref, className: cn(className) }} />
			<TerminalProgram />
			<Wallpaper />
		</React.Fragment>
	);
});
