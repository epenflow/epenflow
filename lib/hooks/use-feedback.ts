'use client';
import { create } from 'zustand';

export type FeedbackType = {
	success: boolean;
	messages: string;
	data: any | null;
};

interface FeedbackState {
	feedback: FeedbackType;
	setFeedback: (data: FeedbackType) => void;
}

export const useFeedback = create<FeedbackState>((set) => {
	return {
		feedback: {
			success: false,
			messages: '',
			data: null,
		},
		setFeedback: (data) => set({ feedback: data }),
	};
});
