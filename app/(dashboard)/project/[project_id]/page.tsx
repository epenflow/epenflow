import { ProjectFiles } from '@/app/(dashboard)/__components__/project-card';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import db from '@/lib/db';
import { useRouter } from 'next/router';

export default async function ProjectIdPage({
	params,
}: {
	params: { project_id: string };
}) {
	const files = await db.files.findMany({
		where: {
			projectId: params.project_id,
		},
	});
	const project = await db.project.findFirst({
		where: {
			projectId: params.project_id,
		},
	});
	console.log(project?.projectName);
	return (
		<main>
			<Card className="m-auto w-1/2">
				<CardHeader>
					<CardTitle>Project--Files</CardTitle>
					<CardTitle>{project?.projectName}</CardTitle>
				</CardHeader>
				<ProjectFiles files={files} />
			</Card>
		</main>
	);
}
