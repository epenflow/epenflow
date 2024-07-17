'use client';
import { cn } from '@/lib/utils';
import { cva, VariantProps } from 'class-variance-authority';
import React from 'react';

const TerminalContentVariants = cva(
	'no-scrollbar terminal-cancel h-full overflow-x-hidden overflow-y-scroll px-2 pb-20 transition-all',
	{
		variants: {
			variant: {
				default: 'flex',
				minimize: 'hidden',
			},
		},
		defaultVariants: {
			variant: 'default',
		},
	},
);
interface TerminalContentProps
	extends React.HTMLAttributes<HTMLDivElement>,
		VariantProps<typeof TerminalContentVariants> {}
export const TerminalContent: React.FC<TerminalContentProps> = ({
	className,
	children,
	variant,
	...rest
}) => {
	return (
		<div
			{...rest}
			className={cn(TerminalContentVariants({ className, variant }))}
		>
			{children}
		</div>
	);
};
