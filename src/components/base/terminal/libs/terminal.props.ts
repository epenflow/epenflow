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
	zIndex: number;
	triggerZIndex: () => void;
	children: React.ReactNode;
	label?: React.ReactNode;
}

export interface TerminalHOCProps extends Partial<ClassName> {
	index: number;
	multiplyZIndex?: number;
	defaultZIndex?: number;
	children: React.ReactNode;
	label?: React.ReactNode;
	position?: { x: number; y: number };
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
export interface TerminalPositionProps extends HTMLDivProps {
	index: number;
	multiplyZIndex?: number;
	defaultZIndex?: number;
}

export interface TerminalZIndexState {
	activeZIndex: Array<number>;
	handleClick: (index: number) => void;
}