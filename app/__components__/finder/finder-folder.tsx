import { FinderWrapper } from '@/app/__components__/finder/finder-wrapper';
import { Mapping } from '@/components/Mapping';
import { Arrow, Folder } from '@/components/terminal/icon';
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
						{/* <Folder
							className="fill-blue-800"
							viewBox="0 0 1000 1000"
							height={20}
							width={20}
						/> */}
						<span className="inline-block basis-1/2 whitespace-nowrap">
							{item.projectName}
						</span>
						{/* 
						<Arrow
							className="h-5 w-5 fill-blue-800"
							height={20}
							width={20}
							viewBox="0 0 1000 1000"
						/> */}
					</div>
				)}
			/>
		</FinderWrapper>
	);
};
