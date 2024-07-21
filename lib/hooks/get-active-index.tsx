'use client';
import { create } from 'zustand';

interface Component {
	id: number;
	zIndex: number;
	initialZIndex: number;
}
interface ActiveIndexState {
	components: Component[];
	addComponent: (component: Component) => void;
	updateZIndex: (id: number) => void;
}
const MAX_Z_INDEX = 200;
export const useZIndex = create<ActiveIndexState>((setter) => ({
	components: [],
	addComponent: (component) =>
		setter((state) => ({
			components: [...state.components, component],
		})),
	updateZIndex: (id: number) =>
		setter((state) => {
			const maxCurrentZIndex = Math.max(
				...state.components.map((comp) => comp.zIndex),
			);
			const newZIndex =
				maxCurrentZIndex >= MAX_Z_INDEX ? 0 : maxCurrentZIndex + 50;
			return {
				components: state.components.map((comp) =>
					comp.id === id ? { ...comp, zIndex: newZIndex } : comp,
				),
			};
		}),
}));
