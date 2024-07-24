'use client';
import { cn } from '@/lib/utils';
import { cva, VariantProps } from 'class-variance-authority';
import React from 'react';

const TerminalButtonVariants = cva(
	'flex items-center justify-center rounded-full transition-colors',
	{
		variants: {
			variant: {
				close: '--red-terminal-button bg-[#FD5754] border border-[#DF494A] hover:border-[#b42e2e] ',
				minimize:
					'--yellow-terminal-button bg-[#FEBB40] border border-[#E1A034] hover:border-[#b4791a]',
				maximize:
					'--green-terminal-button bg-[#34C848] border border-[#30AB3B] hover:border-[#1b8c24]',
			},
		},
		defaultVariants: {
			variant: 'close',
		},
	},
);
interface TerminalButtonProps
	extends React.ButtonHTMLAttributes<HTMLButtonElement>,
		VariantProps<typeof TerminalButtonVariants> {}
export const TerminalButton: React.FC<TerminalButtonProps> = ({
	children,
	className,
	variant,
	...rest
}) => {
	return (
		<button
			{...rest}
			className={cn(TerminalButtonVariants({ className, variant }))}
		>
			{children}
		</button>
	);
};
