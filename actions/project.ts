'use server';
import { ProjectSchema, ProjectSchemaType } from '@/schema/project';
import db from '@/lib/db';
import { FeedbackType } from '@/lib/hooks/use-feedback';
import { revalidatePath } from 'next/cache';

export async function deleteProject(projectId: string) {
	await db.project.delete({
		where: {
			projectId: projectId,
		},
	});
	revalidatePath('/project');
}

export async function addProject(
	values: ProjectSchemaType,
): Promise<FeedbackType> {
	const validatedFields = ProjectSchema.safeParse(values);
	if (!validatedFields.success) {
		return {
			success: false,
			messages: 'Validation error',
			data: null,
		};
	}
	const { projectName } = validatedFields.data;
	const isProjectExist = await db.project.findUnique({
		where: { projectName: projectName },
	});
	if (isProjectExist) {
		return {
			success: false,
			messages: 'Project already in database',
			data: null,
		};
	}
	const createProject = await db.project.create({
		data: {
			projectName: projectName,
		},
	});
	revalidatePath('/project');
	return {
		success: true,
		messages: 'Project created',
		data: createProject,
	};
}

export async function editProject(
	projectId: string,
	values: ProjectSchemaType,
): Promise<FeedbackType> {
	const validatedFields = ProjectSchema.safeParse(values);
	if (!validatedFields.success) {
		return {
			success: false,
			messages: 'Validation error',
			data: null,
		};
	}
	const { projectName } = validatedFields.data;
	const isProjectExist = db.project.findUnique({
		where: {
			projectId: projectId,
		},
	});
	if (!isProjectExist) {
		return {
			success: false,
			messages: `Project id doesn't exist on database`,
			data: null,
		};
	}
	const _editProject = await db.project.update({
		where: {
			projectId: projectId,
		},
		data: {
			projectName: projectName,
			modifiedAt: new Date(),
		},
	});
	revalidatePath('/project');
	return {
		success: false,
		messages: 'Validation error',
		data: _editProject,
	};
}
