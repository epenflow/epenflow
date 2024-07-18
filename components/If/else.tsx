'use client';
import React from 'react';

interface ElseProps {
	children: React.ReactNode;
}
export const Else: React.FC<ElseProps> = ({ children }) => {
	return children;
};
