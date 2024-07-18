'use client';
import { Else } from '@/components/If/else';
import { Then } from '@/components/If/then';
import React from 'react';

interface IfProps {
	children: React.ReactNode;
	condition: boolean;
}
/**
 *## If Components
 * evaluate the condition if condition true should return Then component otherwise if false it will
 * it will return Else component
 */
export const If: React.FC<IfProps> = ({ children, condition }) => {
	return React.Children.toArray(children).find(
		(child) =>
			((child as React.ReactElement).type !== Else) !== !condition ||
			((child as React.ReactElement).type !== Then) !== condition,
	);
};
