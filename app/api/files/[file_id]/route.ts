import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const db = new PrismaClient();
type params = {
	file_id: string;
};
interface Request {
	request: NextRequest;
	params: params;
}
export async function GET(
	request: NextRequest,
	{ params }: { params: params },
) {
	const { file_id } = params;

	if (!file_id) {
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
		const file = await db.files.findFirst({
			where: {
				fileId: file_id,
			},
		});

		if (!file) {
			return NextResponse.json(
				{
					success: false,
					messages: `data ${file_id} not found`,
					data: null,
				},
				{ status: 404 },
			);
		}

		return NextResponse.json(
			{
				success: true,
				messages: `here is your file ${file.fileId}`,
				data: file,
			},
			{ status: 200 },
		);
	} catch (error) {
		console.error('Database error:', error);
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
export async function DELETE(
	request: NextRequest,
	{ params }: { params: params },
) {
	const { file_id } = params;
	if (!file_id) {
		return NextResponse.json(
			{
				success: false,
				messages: 'file_id is missing',
				data: null,
			},
			{ status: 400 },
		);
	}
	const _delete = await db.files.delete({
		where: {
			fileId: file_id,
		},
	});
	return NextResponse.json(
		{
			success: true,
			messages: `delete data ${file_id} success`,
			data: _delete,
		},
		{
			status: 200,
		},
	);
}
