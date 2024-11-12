import { TriggerAction, TriggerState } from "@/components/base/terminal/libs";

export const TRIGGER_STATE: TriggerState = {
	close: false,
	maximize: false,
	minimize: false,
};
export function triggerReducer(
	state: TriggerState,
	action: TriggerAction,
): TriggerState {
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
