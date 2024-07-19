import React from 'react';
import { cn } from '@/lib/utils';
import { cva, VariantProps } from 'class-variance-authority';
import { TerminalButton } from '@/components/terminal/terminal-button';
import {
	Close,
	Fullscreen,
	Maximize,
	Minimize,
} from '@/components/terminal/icon';

const TerminalTriggerVariants = cva('flex gap-1 transition-all', {
	variants: {
		variant: {
			default: 'absolute',
			minimize: 'relative',
		},
	},
	defaultVariants: {
		variant: 'default',
	},
});
interface TerminalTriggerProps
	extends React.HTMLAttributes<React.ElementRef<'div'>>,
		VariantProps<typeof TerminalTriggerVariants> {
	fnClose?: () => void;
	fnMinimize?: () => void;
	fnMaximize?: () => void;
	isFullscreen?: boolean;
}
export const TerminalTrigger: React.FC<TerminalTriggerProps> = ({
	className,
	children,
	variant,
	fnClose,
	fnMaximize,
	fnMinimize,
	isFullscreen = false,
	...rest
}) => {
	return (
		<div
			{...rest}
			className={cn(TerminalTriggerVariants({ className, variant }))}
		>
			<TerminalButton onClick={fnClose} variant="close">
				<Close />
			</TerminalButton>
			<TerminalButton
				disabled={variant === 'minimize' ? true : false}
				onClick={fnMinimize}
				variant="minimize"
			>
				<Minimize />
			</TerminalButton>
			<TerminalButton onClick={fnMaximize} variant="maximize">
				{isFullscreen ? <Maximize /> : <Fullscreen />}
			</TerminalButton>
		</div>
	);
};
