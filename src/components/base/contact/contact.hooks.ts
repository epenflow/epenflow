import { create } from "zustand";

interface ContactState {
	isContact: boolean;
	triggerContact: () => void;
}

export const useContact = create<ContactState>((setter) => ({
	isContact: false,
	triggerContact() {
		setter((state) => {
			return { ...state, isContact: !state.isContact };
		});
	},
}));
