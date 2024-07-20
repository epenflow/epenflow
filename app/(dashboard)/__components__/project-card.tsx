'use client';
import React from 'react';
import { Mapping } from '@/components/Mapping';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';
import { Files } from '@prisma/client';
import Image from 'next/image';
interface ProjectFilesProps {
	files: Files[];
}
export const ProjectFiles: React.FC<ProjectFilesProps> = ({ files }) => {
	return (
		<Table>
			<TableHeader>
				<TableRow>
					<TableHead>Name</TableHead>
				</TableRow>
			</TableHeader>
			<TableBody>
				<Mapping
					items={files}
					render={(file) => (
						<TableRow key={file.fileId}>
							<TableCell>{file.fileName}</TableCell>
							<TableCell>
								<Image
									src={file.fileUrls}
									height={100}
									width={100}
									alt={file.fileName}
								/>
							</TableCell>
							<TableCell>{file.fileSize}</TableCell>
							<TableCell>{file.fileType}</TableCell>
						</TableRow>
					)}
				/>
			</TableBody>
		</Table>
	);
};
