"use client";

import { create } from "zustand";

interface NavbarContext {
	isProfile: boolean;
	isNote: boolean;
	setProfile: () => void;
	setNote: () => void;
}

export const useNavbar = create<NavbarContext>((setter) => ({
	isProfile: true,
	isNote: false,
	setProfile: () => setter((prev) => ({ isProfile: !prev.isProfile })),
	setNote: () => setter((prev) => ({ isNote: !prev.isNote })),
}));
