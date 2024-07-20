'use client';
import { FinderFile } from '@/app/__components__/finder/finder-file';
import { FinderFolder } from '@/app/__components__/finder/finder-folder';
import { FinderImage } from '@/app/__components__/finder/finder-image';
import { Terminal } from '@/app/__components__/terminal';
import { _request } from '@/lib/utils';
import { Files, Project as Projects } from '@prisma/client';
import React from 'react';

interface ProjectProps {
	projects: Projects[];
	files: Files[];
}

export const Project: React.FC<ProjectProps> = ({ files, projects }) => {
	const [selectFolder, setFolder] = React.useState<string>('');
	const [selectFiles, setFiles] = React.useState<string>('');
	function handleFinderFolder(projectId: string) {
		setFiles('');
		setFolder(projectId);
	}
	function handleFinderFile(fileId: string) {
		setFiles(fileId);
	}
	const _files = files.filter((file) => file.projectId === selectFolder);
	const _getFiles = files.find((file) => file.fileId === selectFiles);
	console.log(_getFiles);
	return (
		<Terminal
			label="ALL--Project"
			className="flex-row overflow-y-hidden p-0"
			position={{ x: 20, y: 500 }}
		>
			<FinderFolder
				onClick={handleFinderFolder}
				data={projects}
				selectFolder={selectFolder}
			/>
			{selectFolder === '' ? null : (
				<FinderFile
					files={_files}
					onClick={handleFinderFile}
					selectFiles={selectFiles}
				/>
			)}
			{typeof _getFiles !== 'undefined' && <FinderImage {..._getFiles} />}
		</Terminal>
	);
};
