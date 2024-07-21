import React from 'react';
import { cn } from '@/lib/utils';
import { cva, VariantProps } from 'class-variance-authority';

const TerminalHeaderVariants = cva(
	'flex items-center bg-terminal-header-gradient p-1.5 relative overflow-hidden',
	{
		variants: {
			variant: {
				default: 'rounded-t-lg border shadow-terminal-box-shadow',
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
			id="terminal--header"
			className={cn(TerminalHeaderVariants({ className, variant }))}
		>
			{children}
		</div>
	);
};
