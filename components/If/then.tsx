'use client';
import React from 'react';

interface ThenProps {
	children: React.ReactNode;
}
export const Then: React.FC<ThenProps> = ({ children }) => {
	return children;
};
