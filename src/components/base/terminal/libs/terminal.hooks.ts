"use client";
import React from "react";
import { create } from "zustand";
import {
	TerminalContext,
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
