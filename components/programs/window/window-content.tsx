import { cn } from '@/lib/utils';
import { cva, VariantProps } from 'class-variance-authority';
import React from 'react';
const WindowContentVariants = cva(
	'window-cancel w-full overflow-x-hidden overflow-y-scroll transition-all',
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
interface WindowContentProps
	extends React.HTMLAttributes<HTMLDivElement>,
		VariantProps<typeof WindowContentVariants> {}
export const WindowContent: React.FC<WindowContentProps> = ({
	children,
	variant,
	className,
	...rest
}) => {
	return (
		<div
			{...rest}
			className={cn(WindowContentVariants({ className, variant }))}
			style={{
				height: `calc(100% - 32px)`,
			}}
		>
			{children}
		</div>
	);
};
