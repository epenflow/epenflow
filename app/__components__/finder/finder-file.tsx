import { FinderWrapper } from '@/app/__components__/finder/finder-wrapper';
import { Mapping } from '@/components/Mapping';
import { cn } from '@/lib/utils';
import { Files } from '@prisma/client';
import Image from 'next/image';

export const FinderFile = ({
	files,
	onClick,
	selectFiles,
}: {
	files: Files[];
	onClick: (projectId: string) => void;
	selectFiles?: string;
}) => {
	return (
		<FinderWrapper className="border-r">
			{files.length === 0 ? (
				<div className="flex cursor-pointer flex-row items-center justify-between space-x-2">
					<span className="inline-block basis-1/2 whitespace-nowrap">
						Files not found
					</span>
				</div>
			) : (
				<Mapping
					items={files}
					render={(item, key) => (
						<div
							key={key}
							className={cn(
								'flex cursor-pointer flex-row items-center justify-between space-x-2',
								selectFiles === item.fileId && 'bg-gray-200',
							)}
							onClick={() => onClick(item.fileId)}
						>
							<Image
								src={'/macOs--file.png'}
								height={20}
								width={20}
								alt="macOs--file"
							/>

							<span className="inline-block basis-1/2 whitespace-nowrap">
								{item.fileName}
							</span>
						</div>
					)}
				/>
			)}
		</FinderWrapper>
	);
};
