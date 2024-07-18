'use client';
import { cn } from '@/lib/utils';
import React from 'react';

interface WindowTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {}
export const WindowTitle = React.forwardRef<
	HTMLHeadingElement,
	WindowTitleProps
>(({ className, children, ...rest }, ref) => {
	return (
		<h1
			ref={ref}
			{...rest}
			className={cn(
				'line-clamp-1 flex-1 truncate font-mono text-white',
				className,
			)}
		>
			{children}
		</h1>
	);
});
WindowTitle.displayName = 'WindowTitle';
