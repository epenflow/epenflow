import { cn } from '@/lib/utils';
import React from 'react';

interface WindowHeaderProps extends React.HTMLAttributes<HTMLDivElement> {}
export const WindowHeader: React.FC<WindowHeaderProps> = ({
	children,
	className,
	...rest
}) => {
	return (
		<div
			{...rest}
			id="window--header"
			className={cn(
				'flex w-full items-center gap-2 bg-window-header-gradient p-1',
				className,
			)}
		>
			{children}
		</div>
	);
};
