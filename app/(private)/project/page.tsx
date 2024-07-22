import { ProjectTable } from '@/app/(private)/__components__/project-table';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import db from '@/lib/db';

export default async function ProjectPage() {
	const project = await db.project.findMany();
	return (
		<main className="flex h-screen w-screen justify-center px-2.5 py-5">
			<Card className="w-full rounded-md lg:w-1/2">
				<CardHeader className="space-y-2.5">
					<CardTitle>ALL--Project</CardTitle>
					<Button size={'sm'} className="w-1/4">
						ADD--Project
					</Button>
				</CardHeader>
				<CardContent>
					<ProjectTable project={project} />
				</CardContent>
			</Card>
		</main>
	);
}
