import { cn } from '@/lib/utils';
import { cva, VariantProps } from 'class-variance-authority';
import React from 'react';

const TerminalModalVariants = cva('transition-opacity', {
	variants: {
		variant: {
			default: 'w-fit h-fit bg-opacity-0',
			maximize:
				'fixed top-0 left-0 h-screen w-screen flex items-center justify-center z-50 bg-opacity-100',
		},
	},
	defaultVariants: {
		variant: 'default',
	},
});
interface TerminalModalProps
	extends React.HTMLAttributes<HTMLDivElement>,
		VariantProps<typeof TerminalModalVariants> {}
export const TerminalModal: React.FC<TerminalModalProps> = ({
	children,
	className,
	variant,
	...rest
}) => {
	return (
		<div
			{...rest}
			className={cn(TerminalModalVariants({ className, variant }))}
		>
			{children}
		</div>
	);
};
