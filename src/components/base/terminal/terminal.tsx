"use client";
import React from "react";
import "./terminal.css";
import {
	BaseTerminalProps,
	TerminalHOC,
} from "@/components/base/terminal/terminal.hoc";
/**
 *
 * ----------------------------------------------------------
 * Base Terminal Components
 * ----------------------------------------------------------
 *
 */
import {
	TerminalContainer,
	TerminalHeader,
	TerminalContent,
	TerminalAction,
	TerminalTitle,
	TerminalPortal,
} from "@/components/base/terminal/base";
import { useTerminal } from "@/components/base/terminal/helpers";

const BaseTerminal: React.FC<BaseTerminalProps> = ({
	containerRef: ref,
	header,
	...rest
}) => {
	const { isTrigger, setTrigger } = useTerminal();
	return (
		<div
			{...{ ref }}
			className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
			<TerminalPortal condition={isTrigger.minimize}>
				<TerminalContainer>
					<TerminalHeader>
						<TerminalAction />
						<TerminalTitle>{header}</TerminalTitle>
					</TerminalHeader>
					<TerminalContent {...rest} />
				</TerminalContainer>
			</TerminalPortal>
		</div>
	);
};

export const Terminal = TerminalHOC(BaseTerminal);
