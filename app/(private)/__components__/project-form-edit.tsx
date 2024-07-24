import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form';
import { ProjectSchema, ProjectSchemaType } from '@/schema/project';
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { editProject } from '@/actions/project';
import { useFeedback } from '@/lib/hooks/use-feedback';
interface ProjectFormEditProps {
	projectName: string;
	projectId: string;
	_handleEdit: () => void;
}
export const ProjectFormEdit: React.FC<ProjectFormEditProps> = ({
	projectName,
	projectId,
	_handleEdit,
}) => {
	const { feedback, setFeedback } = useFeedback();
	const form = useForm<ProjectSchemaType>({
		resolver: zodResolver(ProjectSchema),
		defaultValues: {
			projectName: projectName || undefined,
		},
	});
	function handleSubmit(values: ProjectSchemaType) {
		setFeedback({
			data: null,
			messages: '',
			success: false,
		});
		editProject(projectId, values).then((response) => {
			setFeedback(response);
			if (response.success) {
				_handleEdit();
			}
		});
	}
	return (
		<Form {...form}>
			<form
				className="space-y-5"
				onSubmit={form.handleSubmit(handleSubmit)}
			>
				<FormField
					control={form.control}
					name="projectName"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Project--Name</FormLabel>
							<FormControl>
								<Input {...field} type="text" />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<Button type="submit">Save--Project</Button>
			</form>
		</Form>
	);
};
