import { cn } from '@/lib/utils';
import React from 'react';

interface TerminalTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {}
export const TerminalTitle = React.forwardRef<
	React.ElementRef<'h1'>,
	TerminalTitleProps
>(({ children, className, ...rest }, ref) => {
	return (
		<h1
			{...rest}
			ref={ref}
			id="terminal--title"
			className={cn(
				'terminal-handler line-clamp-1 flex w-full cursor-grab items-center justify-center truncate font-mono text-sm font-bold text-foreground/75',
				className,
			)}
		>
			{children}
		</h1>
	);
});

TerminalTitle.displayName = 'TerminalTitle';
