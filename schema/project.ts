import * as z from 'zod';
export const ProjectSchema = z.object({
	projectName: z.string().min(3, {
		message: 'Project name is required',
	}),
});
export type ProjectSchemaType = z.infer<typeof ProjectSchema>;
