import db from '@/lib/db';
import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';
const supabase = createClient(
	process.env.NEXT_PUBLIC_SUPABASE_URL!,
	process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
);
export async function GET() {
	const files = await db.files.findMany();
	return NextResponse.json(
		{
			success: true,
			messages: 'Here is your files',
			data: files,
		},
		{ status: 200 },
	);
}
export async function POST(request: NextRequest) {
	const body = await request.formData();
	const files = body.getAll('files') as File[];
	const project_id = body.get('project_id') as string;

	if (files.length === 0) {
		return NextResponse.json(
			{ success: false, message: 'No files uploaded' },
			{ status: 400 },
		);
	}

	const { size, type, name, lastModified } = files[0];

	const existingProject = await db.project.findUnique({
		where: {
			projectId: project_id,
		},
	});
	if (!existingProject) {
		return NextResponse.json(
			{
				success: false,
				messages: `${project_id} data not found`,
				data: existingProject,
			},
			{ status: 404 },
		);
	}
	const createdFiles = await supabase.storage
		.from('files')
		.upload(`/uploads/${name}`, files[0]);
	const fileUrls = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/files/uploads/${name}`;
	const created = await db.files.create({
		data: {
			projectId: project_id,
			fileName: name,
			fileSize: size,
			fileType: type,
			createdAt: new Date(lastModified),
			fileUrls: fileUrls,
		},
	});
	return NextResponse.json({
		success: true,
		message: 'created file success',
		data: created,
		files: createdFiles,
	});
}
