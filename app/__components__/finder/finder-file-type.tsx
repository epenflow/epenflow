import Image from 'next/image';
import React from 'react';

interface FinderFileTypeProps {
	fileType: string;
	fileName: string;
	fileUrls: string;
}
export const FinderFileType: React.FC<FinderFileTypeProps> = ({
	fileName,
	fileType,
	fileUrls,
}) => {
	if (fileType !== 'video/mp4') {
		return <Image src={fileUrls} height={100} width={200} alt={fileName} />;
	}
	return (
		<video width={200} height={100} controls preload="none">
			<source src={fileUrls} type={fileType} />
		</video>
	);
};
