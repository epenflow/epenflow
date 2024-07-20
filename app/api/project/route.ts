import db from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
	const project = await db.project.findMany();
	return NextResponse.json(
		{
			success: true,
			messages: 'Here is project data',
			data: project,
		},
		{ status: 200 },
	);
}
export async function POST(request: NextRequest) {
	const { project_name } = await request.json();
	const project = await db.project.findUnique({
		where: {
			projectName: project_name,
		},
	});
	if (project) {
		return NextResponse.json(
			{
				success: false,
				messages: `${project_name} already in database`,
				data: project,
			},
			{ status: 409 },
		);
	}
	const created = await db.project.create({
		data: {
			projectName: project_name,
		},
	});
	return NextResponse.json(
		{
			success: true,
			messages: 'created project name success',
			data: created,
		},
		{ status: 200 },
	);
}
