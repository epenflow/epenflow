import { cn } from '@/lib/utils';
import { cva, VariantProps } from 'class-variance-authority';
import React from 'react';

const ProgramsModalVariants = cva('transition-opacity', {
	variants: {
		variant: {
			default: 'w-fit h-fit bg-opacity-0 z-30',
			maximize:
				'fixed top-0 left-0 h-screen w-screen flex items-center justify-center z-50 bg-opacity-100',
			minimize: 'w-full h-fit',
		},
	},
	defaultVariants: {
		variant: 'default',
	},
});
interface ProgramsModalProps
	extends React.HTMLAttributes<HTMLDivElement>,
		VariantProps<typeof ProgramsModalVariants> {}
export const ProgramsModal: React.FC<ProgramsModalProps> = ({
	children,
	className,
	variant,
	...rest
}) => {
	return (
		<div
			{...rest}
			id="program--modal"
			className={cn(ProgramsModalVariants({ className, variant }))}
		>
			{children}
		</div>
	);
};
