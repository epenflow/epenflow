"use client";
import React from "react";

interface TriggerState {
	close: boolean;
	maximize: boolean;
	minimize: boolean;
}
type Action = "CLOSE" | "MAXIMIZE" | "MINIMIZE";
interface TerminalContext {
	isTrigger: TriggerState;
	draggableTriggerRef: React.RefObject<HTMLDivElement>;
	setTrigger: React.Dispatch<Action>;
}

const trigger: TriggerState = {
	close: false,
	maximize: false,
	minimize: false,
};
const context = React.createContext<TerminalContext | undefined>(undefined);

function reducer(state: TriggerState, action: Action) {
	switch (action) {
		case "CLOSE":
			return { ...state, close: true };
		case "MAXIMIZE":
			if (state.minimize) {
				return { ...state, minimize: false };
			}
			return {
				...state,
				maximize: !state.maximize,
			};
		case "MINIMIZE":
			return {
				...state,
				minimize: !state.minimize,
				maximize: state.maximize ? false : state.maximize,
			};
		default:
			return state;
	}
}

export const TerminalProvider = ({ children }: React.PropsWithChildren) => {
	const draggableTriggerRef = React.useRef<HTMLDivElement | null>(null);
	const [isTrigger, setTrigger] = React.useReducer(reducer, trigger);

	return (
		<context.Provider
			value={{ isTrigger, setTrigger, draggableTriggerRef }}>
			{children}
		</context.Provider>
	);
};

export function useTerminal() {
	const terminal = React.useContext(context);

	if (typeof terminal === "undefined") {
		throw new Error(`useTerminal must be use within TerminalProvider`);
	}

	return terminal;
}
