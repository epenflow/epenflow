import React from "react";
import {
	terminalButtonListVariants,
	terminalButtonVariants,
	terminalCardVariants,
	terminalContentVariants,
	terminalHeaderVariants,
	terminalModalVariants,
} from "@/components/base/terminal/libs/terminal.variants";
import { type VariantProps } from "class-variance-authority";
import { Draggable } from "gsap/Draggable";

interface HTMLDivProps extends React.ComponentPropsWithRef<"div"> {}
interface ClassName {
	classNameContent: string;
	classNameModal: string;
	classNameCard: string;
	classNameHeader: string;
	classNameButtonList: string;
	classNameLabel: string;
}

export interface TerminalButtonProps
	extends React.ComponentPropsWithoutRef<"button">,
		VariantProps<typeof terminalButtonVariants> {}

export interface TerminalHeaderProps
	extends HTMLDivProps,
		VariantProps<typeof terminalHeaderVariants> {}

export interface TerminalCardProps
	extends HTMLDivProps,
		VariantProps<typeof terminalCardVariants> {}

export interface TerminalContentProps
	extends HTMLDivProps,
		VariantProps<typeof terminalContentVariants> {}

export interface TerminalButtonListProps
	extends HTMLDivProps,
		VariantProps<typeof terminalButtonListVariants> {}

export interface TerminalLabelProps
	extends React.ComponentPropsWithoutRef<"h1"> {}

export interface TerminalProps extends Partial<ClassName> {
	containerRef: React.RefObject<HTMLDivElement>;
	children: React.ReactNode;
	label?: React.ReactNode;
}
interface Positions {
	x: number;
	y: number;
	xPercent: number;
	yPercent: number;
	top: number;
	left: number;
}
export interface TerminalHOCProps extends Partial<ClassName> {
	children: React.ReactNode;
	label?: React.ReactNode;
}

export interface TriggerState {
	close: boolean;
	maximize: boolean;
	minimize: boolean;
}
export type TriggerAction = "CLOSE" | "MINIMIZE" | "MAXIMIZE";
export interface TerminalContext {
	isTrigger: TriggerState;
	trigger: React.Dispatch<TriggerAction>;
}

export interface TerminalModalProps
	extends HTMLDivProps,
		VariantProps<typeof terminalModalVariants> {}

export interface TerminalPortalProps {
	children: React.ReactNode;
	condition: boolean;
}
