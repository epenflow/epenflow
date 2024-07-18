'use client';
import React from 'react';

interface WhenProps {
	children: React.ReactNode;
}
export const When: React.FC<WhenProps> = ({ children }) => {
	return children;
};
