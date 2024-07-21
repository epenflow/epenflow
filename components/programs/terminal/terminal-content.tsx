import { cn } from '@/lib/utils';
import { cva, VariantProps } from 'class-variance-authority';
import React from 'react';

const TerminalContentVariants = cva(
	'terminal-cancel no-scrollbar h-full overflow-x-hidden overflow-y-scroll transition-all',
	{
		variants: {
			variant: {
				default: 'flex flex-col',
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
			style={{
				height: `calc(100% - 33.6px)`,
			}}
		>
			{children}
		</div>
	);
};
