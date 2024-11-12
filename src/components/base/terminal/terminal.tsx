"use client";
import React from "react";
import "./terminal.css";
import {
	TerminalButtonList,
	TerminalCard,
	TerminalContent,
	TerminalHeader,
	TerminalLabel,
	TerminalModal,
} from "@/components/base/terminal/base";
import { TerminalHOC } from "@/components/base/terminal/terminal.hoc";
import {
	TerminalProps,
	useTerminal,
	useVariants,
} from "@/components/base/terminal/libs";
import { TerminalPortal } from "@/components/base/terminal/terminal.portal";

export const BaseTerminal: React.FC<TerminalProps> = ({
	containerRef,
	triggerZIndex,
	zIndex,
	children,
	label,
	classNameButtonList,
	classNameCard,
	classNameContent,
	classNameHeader,
	classNameLabel,
	classNameModal,
}) => {
	const { isTrigger } = useTerminal();
	const { sizeVariant, minimizeVariant } = useVariants(isTrigger);

	return (
		<TerminalModal
			{...{
				ref: containerRef,
				size: sizeVariant,
				style: { zIndex },
				onMouseDown: triggerZIndex,
				onTouchStart: triggerZIndex,
				className: classNameModal,
			}}>
			<TerminalPortal condition={isTrigger.minimize}>
				<TerminalCard
					{...{ size: sizeVariant, className: classNameCard }}>
					<TerminalHeader
						{...{
							variant: minimizeVariant,
							className: classNameHeader,
						}}>
						<TerminalButtonList
							{...{
								variant: minimizeVariant,
								className: classNameButtonList,
							}}
						/>
						<TerminalLabel className={classNameLabel}>
							{label ? label : <span>Terminal</span>}
						</TerminalLabel>
					</TerminalHeader>
					<TerminalContent
						{...{
							variant: minimizeVariant,
							className: classNameContent,
						}}>
						{children}
					</TerminalContent>
				</TerminalCard>
			</TerminalPortal>
		</TerminalModal>
	);
};

export const Terminal = TerminalHOC(BaseTerminal);
