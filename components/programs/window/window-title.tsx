import { cn } from '@/lib/utils';
import React from 'react';

interface WindowTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {}
export const WindowTitle = React.forwardRef<
	React.ElementRef<'h1'>,
	WindowTitleProps
>(({ className, children, ...rest }, ref) => {
	return (
		<h1
			ref={ref}
			{...rest}
			id="window--title"
			className={cn(
				'line-clamp-1 flex-1 truncate font-mono text-white transition-all hover:cursor-grab',
				className,
			)}
		>
			{children}
		</h1>
	);
});
WindowTitle.displayName = 'WindowTitle';
