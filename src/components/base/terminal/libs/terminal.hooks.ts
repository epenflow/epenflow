"use client";
import React from "react";
import { create } from "zustand";
import {
	TerminalContext,
	TerminalZIndexState,
	TriggerState,
} from "@/components/base/terminal/libs/terminal.props";

export const CreateTerminalContext = React.createContext<
	TerminalContext | undefined
>(undefined);

export function useTerminal() {
	const context = React.useContext(CreateTerminalContext);

	if (typeof context === "undefined")
		throw new Error(
			"useTerminalContext must be used within TerminalProvider",
		);

	return context;
}

export function useVariants(isTrigger: TriggerState) {
	const sizeVariant: "minimize" | "maximize" | "default" = isTrigger.minimize
		? "minimize"
		: isTrigger.maximize
			? "maximize"
			: "default";

	const minimizeVariant: "minimize" | "default" = isTrigger.minimize
		? "minimize"
		: "default";

	return { sizeVariant, minimizeVariant };
}

export const useTerminalZIndex = create<TerminalZIndexState>((setter) => ({
	activeZIndex: [],
	handleClick: (index: number) => {
		setter((state) => {
			const current = state.activeZIndex.filter(
				(prevIndex) => prevIndex !== index,
			);
			return { activeZIndex: [...current, index] };
		});
	},
}));
