import { FinderWrapper } from '@/app/__components__/finder/finder-wrapper';
import { Mapping } from '@/components/Mapping';
import { cn } from '@/lib/utils';
import { Project } from '@prisma/client';
import React from 'react';
export const FinderFolder = ({
	data,
	onClick,
	selectFolder,
}: {
	data: Project[];
	onClick: (projectId: string) => void;
	selectFolder?: string;
}) => {
	return (
		<FinderWrapper className={`border-r`}>
			<Mapping
				items={data}
				render={(item, key) => (
					<div
						key={key}
						className={cn(
							'flex flex-row items-center',
							selectFolder === item.projectId && 'bg-gray-200',
						)}
						onClick={() => onClick(item.projectId)}
					>
						<span className="inline-block basis-1/2 whitespace-nowrap">
							{item.projectName}
						</span>
					</div>
				)}
			/>
		</FinderWrapper>
	);
};
