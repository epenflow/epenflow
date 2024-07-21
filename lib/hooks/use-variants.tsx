'use client';
import React from 'react';

type CardVariants = 'default' | 'maximize' | 'minimize';
type ContentVariants = Exclude<CardVariants, 'maximize'>;
type ModalVariants = CardVariants;
type HeaderVariants = Exclude<CardVariants, 'maximize'>;
type TriggerVariants = Exclude<CardVariants, 'maximize'>;
export function useVariants(isMinimize: boolean, isMaximize: boolean) {
	const cardVariants: CardVariants = isMinimize
		? 'minimize'
		: isMaximize
			? 'maximize'
			: 'default';
	const contentVariants: ContentVariants = isMinimize
		? 'minimize'
		: 'default';
	const modalVariants: ModalVariants = isMaximize
		? 'maximize'
		: isMinimize
			? 'minimize'
			: 'default';
	const headerVariants: HeaderVariants = isMinimize ? 'minimize' : 'default';
	const triggerVariants: TriggerVariants = isMinimize
		? 'minimize'
		: 'default';
	const values = React.useMemo(() => {
		return {
			cardVariants,
			contentVariants,
			modalVariants,
			headerVariants,
			triggerVariants,
		};
	}, [
		cardVariants,
		contentVariants,
		modalVariants,
		headerVariants,
		triggerVariants,
	]);
	return values;
}
