import { ProjectTable } from '@/app/(private)/__components__/project-table';
import { Button } from '@/components/ui/button';
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import db from '@/lib/db';

export default async function ProjectPage() {
	const projects = await db.project.findMany();
	return (
		<main className="flex w-full justify-center overflow-x-hidden px-2.5 py-5">
			<Card className="w-full lg:w-1/2">
				<CardHeader>
					<CardTitle>ALL--Project</CardTitle>
				</CardHeader>
				<CardContent className="space-y-2.5">
					<ProjectTable projects={projects} />
				</CardContent>
				<CardFooter>
					<Button className="w-1/5" size="sm">
						ADD--Project
					</Button>
				</CardFooter>
			</Card>
		</main>
	);
}
