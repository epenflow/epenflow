'use client';
import { cn } from '@/lib/utils';
import React from 'react';

interface TerminalTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {}
export const TerminalTitle = React.forwardRef<
	HTMLHeadingElement,
	TerminalTitleProps
>(({ children, className, ...rest }, ref) => {
	return (
		<h1
			{...rest}
			ref={ref}
			className={cn(
				'terminal-handler line-clamp-1 flex w-full cursor-grab items-center justify-center font-mono text-sm font-bold text-muted-foreground',
				className,
			)}
		>
			{children}
		</h1>
	);
});

TerminalTitle.displayName = 'TerminalTitle';