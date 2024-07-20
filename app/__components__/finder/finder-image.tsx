'use client';
import { FinderFileInformation } from '@/app/__components__/finder/finder-file-information';
import { FinderWrapper } from '@/app/__components__/finder/finder-wrapper';
import { formatDate } from '@/lib/server/format-date';
import Image from 'next/image';
import React from 'react';
import { Files } from '@prisma/client';
import { FinderFileType } from '@/app/__components__/finder/finder-file-type';
interface FinderImageProps extends Files {}
const formatBytes = (bytes: number) => {
	const units = ['b', 'kb', 'mb', 'gb', 'tb'];

	let i = 0;

	for (i; bytes >= 1024 && i < 4; i++) {
		bytes /= 1024;
	}

	return `${bytes.toFixed(2)} ${units[i]}`;
};

export const FinderImage: React.FC<FinderImageProps> = ({
	createdAt,
	fileName,
	fileSize,
	fileUrls,
	modifiedAt,
	fileType,
}) => {
	return (
		<FinderWrapper className="flex grow basis-1/2 flex-col items-center space-y-5 px-2 py-5">
			{fileType && (
				<FinderFileType
					fileName={fileName}
					fileType={fileType}
					fileUrls={fileUrls}
				/>
			)}
			<h1 className="uppercase">{fileName}</h1>
			{fileSize && (
				<span className="text-sm font-bold capitalize">
					{fileType} - {formatBytes(fileSize)}
				</span>
			)}
			<FinderFileInformation className="border-b">
				<span>created at</span>
				{createdAt && <span>{formatDate(createdAt)}</span>}
			</FinderFileInformation>
			<FinderFileInformation className="border-b">
				<span>modified at</span>
				{modifiedAt && <span>{formatDate(modifiedAt)}</span>}
			</FinderFileInformation>
			<FinderFileInformation>
				<span>size</span>
				{fileSize && <span>{fileSize}</span>}
			</FinderFileInformation>
		</FinderWrapper>
	);
};
