import { cn } from '@/lib/utils';
import Image from 'next/image';
import React from 'react';

interface WindowButtonProps
	extends React.ButtonHTMLAttributes<HTMLButtonElement> {
	iconHref: string;
}
export const WindowButton: React.FC<WindowButtonProps> = ({
	className,
	iconHref,
	...rest
}) => {
	return (
		<button
			{...rest}
			className={cn('h-3.5 w-3.5 bg-white', className)}
			style={{
				border: '1px outset #dad7d2',
			}}
		>
			<Image
				src={iconHref}
				width={0}
				height={0}
				sizes="100vw"
				style={{ width: '100%', height: 'auto' }}
				alt={iconHref.replace('.jpg', '').replace('/', '')}
			/>
		</button>
	);
};
