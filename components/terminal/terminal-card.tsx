'use client';
import { cn } from '@/lib/utils';
import { cva, VariantProps } from 'class-variance-authority';
import React from 'react';

const TerminalCardVariants = cva(
	'border-terminal-default bg-card rounded-lg transition-all',
	{
		variants: {
			variant: {
				default:
					'xl:w-[50vw] xl:h-[70vh] sm:w-[60vw] sm:h-[50vh] md:w-[75vw] md:h-[50vh] lg:w-[65vw] lg:h-[50vh] w-[90vw] h-[50vh]',
				maximize: 'w-[90vw] h-[90vh]',
				minimize: 'w-full h-fit',
			},
		},

		defaultVariants: {
			variant: 'default',
		},
	},
);
type TerminalState = 'minimize' | 'maximize' | 'default';
interface TerminalCardProps
	extends React.HTMLAttributes<HTMLDivElement>,
		VariantProps<typeof TerminalCardVariants> {
	state?: TerminalState;
}
export const TerminalCard = React.forwardRef<HTMLDivElement, TerminalCardProps>(
	({ children, className, variant, state, ...rest }, ref) => {
		return (
			<div
				{...rest}
				ref={ref}
				className={cn(
					'terminal-cancel overflow-hidden',
					TerminalCardVariants({ className, variant }),
				)}
			>
				{children}
			</div>
		);
	},
);
TerminalCard.displayName = 'TerminalCard';
