'use client';
import { clientQuery } from '@/lib/utils';
import { QueryClientProvider } from '@tanstack/react-query';
import React from 'react';

interface ReactQueryProviderProps {
	children: React.ReactNode;
}
export const ReactQueryProvider: React.FC<ReactQueryProviderProps> = ({
	children,
}) => {
	return (
		<QueryClientProvider client={clientQuery}>
			{children}
		</QueryClientProvider>
	);
};
