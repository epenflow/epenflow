import { cn } from '@/lib/utils';
import React from 'react';

interface FinderWrapperProps extends React.HTMLAttributes<HTMLDivElement> {}
export const FinderWrapper: React.FC<FinderWrapperProps> = ({
	children,
	className,
	...rest
}) => {
	return (
		<div
			{...rest}
			className={cn(
				'terminal-scrollbar flex-1 basis-1/4 overflow-scroll',
				className,
			)}
		>
			{children}
		</div>
	);
};
