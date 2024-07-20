import { cn } from '@/lib/utils';
import React from 'react';

interface FinderFileInformationProps
	extends React.HTMLAttributes<HTMLDivElement> {}
export const FinderFileInformation: React.FC<FinderFileInformationProps> = ({
	children,
	className,
	...rest
}) => {
	return (
		<div
			{...rest}
			className={cn(
				'flex w-full flex-row justify-between text-sm capitalize',
				className,
			)}
		>
			{children}
		</div>
	);
};
