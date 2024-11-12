"use client";
import React from "react";
import {
	CreateTerminalContext,
	TRIGGER_STATE,
	triggerReducer,
} from "@/components/base/terminal/libs";

export function TerminalProvider({ children }: { children: React.ReactNode }) {
	const [isTrigger, trigger] = React.useReducer(
		triggerReducer,
		TRIGGER_STATE,
	);

	return (
		<CreateTerminalContext.Provider value={{ isTrigger, trigger }}>
			{children}
		</CreateTerminalContext.Provider>
	);
}
