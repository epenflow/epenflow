'use client';
import { Minimize } from '@/components/terminal/icon';
import { Close } from '@/components/window/icon';
import { WindowButton } from '@/components/window/window-button';
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
			className={cn(
				'bg-window-header-gradient flex w-full items-center gap-2 p-1',
				className,
			)}
		>
			{children}
		</div>
	);
};