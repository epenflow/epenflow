'use server';

import { Mapping } from '@/components/Mapping';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';
import db from '@/lib/db';
import { formatDates } from '@/lib/format-dates';

export const ProjectTable = async () => {
	const projects = await db.project.findMany();
	return (
		<Table>
			<TableHeader>
				<TableRow>
					<TableHead>Project--Name</TableHead>
					<TableHead>Project--Created/AT</TableHead>
					<TableHead>Project--Modified/AT</TableHead>
					<TableHead>Project--Actions</TableHead>
				</TableRow>
			</TableHeader>
			<TableBody>
				<Mapping
					items={projects}
					render={(project) => (
						<TableRow key={project.projectId}>
							<TableCell>{project.projectName}</TableCell>
							<TableCell>
								{formatDates(project.createdAt)}
							</TableCell>
							<TableCell>
								{formatDates(project.modifiedAt)}
							</TableCell>
						</TableRow>
					)}
				/>
			</TableBody>
		</Table>
	);
};
