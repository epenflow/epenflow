import { cn } from '@/lib/utils';
import { cva, VariantProps } from 'class-variance-authority';
import React from 'react';

const WindowCardVariants = cva(
	'window-border bg-card rounded-none transition-all shadow-terminal-100',
	{
		variants: {
			variant: {
				default:
					'xl:w-[50vw] xl:h-[70vh] sm:w-[60vw] sm:h-[50vh] md:w-[75vw] md:h-[50vh] lg:w-[65vw] lg:h-[50vh] w-[90vw] h-[50vh]',
				maximize: 'w-[90vw] h-[90vh]',
				minimize: 'h-fit w-full',
			},
		},

		defaultVariants: {
			variant: 'default',
		},
	},
);
interface WindowCardProps
	extends React.HTMLAttributes<HTMLDivElement>,
		VariantProps<typeof WindowCardVariants> {}
export const WindowCard: React.FC<WindowCardProps> = ({
	children,
	className,
	variant,
	...rest
}) => {
	return (
		<div
			{...rest}
			className={cn(WindowCardVariants({ className, variant }))}
		>
			{children}
		</div>
	);
};
