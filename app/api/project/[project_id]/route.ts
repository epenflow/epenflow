import db from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';

export async function GET(
	request: NextRequest,
	{
		params,
	}: {
		params: {
			project_id: string;
		};
	},
) {
	if (!params.project_id) {
		return NextResponse.json(
			{
				success: false,
				messages: 'file_id is missing',
				data: null,
			},
			{ status: 400 },
		);
	}
	try {
		const project = await db.files.findMany({
			where: {
				projectId: params.project_id,
			},
		});
		if (!project) {
			return NextResponse.json(
				{
					success: false,
					messages: `data ${params.project_id} not found`,
					data: null,
				},
				{ status: 404 },
			);
		}
		return NextResponse.json({
			success: true,
			messages: 'here is your data',
			data: project,
		});
	} catch (error) {
		return NextResponse.json(
			{
				success: false,
				messages: 'An error occurred while fetching the file',
				data: null,
			},
			{ status: 500 },
		);
	}
}
