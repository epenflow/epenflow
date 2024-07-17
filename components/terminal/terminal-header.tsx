'use client';
import React from 'react';
import { cn } from '@/lib/utils';
import { cva, VariantProps } from 'class-variance-authority';

const TerminalHeaderVariants = cva(
	'flex items-center bg-terminal-300 p-2 relative overflow-hidden',
	{
		variants: {
			variant: {
				default:
					'rounded-t-lg border border-b-terminal-400 shadow-terminal-100',
				minimize: 'rounded-lg gap-2 w-full',
			},
		},
		defaultVariants: {
			variant: 'default',
		},
	},
);
interface TerminalHeaderProps
	extends React.HTMLAttributes<React.ElementRef<'div'>>,
		VariantProps<typeof TerminalHeaderVariants> {}
export const TerminalHeader: React.FC<TerminalHeaderProps> = ({
	children,
	className,
	variant,
	...rest
}) => {
	return (
		<div
			{...rest}
			className={cn(TerminalHeaderVariants({ className, variant }))}
		>
			{children}
		</div>
	);
};
