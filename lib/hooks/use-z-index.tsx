'use client';
import { create } from 'zustand';
interface ZIndexState {
	activeZIndex: number[];
	handleClick: (id: number) => void;
}
export const useZIndex = create<ZIndexState>((setter) => ({
	activeZIndex: [],
	handleClick: (id: number) =>
		setter((state) => {
			const current = state.activeZIndex.filter((index) => index !== id);
			return { activeZIndex: [...current, id] };
		}),
}));
