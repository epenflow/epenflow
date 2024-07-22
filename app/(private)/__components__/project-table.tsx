'use client';
import { Mapping } from '@/components/Mapping';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';
import {
	DotsHorizontalIcon,
	Pencil2Icon,
	TrashIcon,
} from '@radix-ui/react-icons';
import { formatDates } from '@/lib/format-dates';
import { Project } from '@prisma/client';
import { DropdownMenuLabel } from '@radix-ui/react-dropdown-menu';
import { deleteProject } from '@/actions/project';
import { Button } from '@/components/ui/button';

interface ProjectTableProps {
	project: Project[];
}
export const ProjectTable = ({ project }: ProjectTableProps) => {
	function handleDelete(projectId: string) {
		deleteProject(projectId);
	}
	return (
		<Table>
			<TableHeader>
				<TableRow>
					<TableHead>Name</TableHead>
					<TableHead>Created</TableHead>
					<TableHead>Modified</TableHead>
					<TableHead>Actions</TableHead>
				</TableRow>
			</TableHeader>
			<TableBody>
				<Mapping
					items={project}
					render={(item) => (
						<TableRow key={item.projectId}>
							<TableCell>{item.projectName}</TableCell>
							<TableCell>{formatDates(item.createdAt)}</TableCell>
							<TableCell>
								{formatDates(item.modifiedAt)}
							</TableCell>
							<TableCell>
								<DropdownMenu>
									<DropdownMenuTrigger asChild>
										<DotsHorizontalIcon className="h-5 w-5" />
									</DropdownMenuTrigger>
									<DropdownMenuContent align="end">
										<DropdownMenuLabel>
											Menu
										</DropdownMenuLabel>
										<DropdownMenuSeparator />
										<DropdownMenuGroup>
											<DropdownMenuItem>
												<Pencil2Icon className="h-5 w-5" />
												<span>Update</span>
											</DropdownMenuItem>
											<DropdownMenuItem
												onClick={() => {
													handleDelete(
														item.projectId,
													);
												}}
											>
												<TrashIcon className="h-5 w-5" />
												<span>Delete</span>
											</DropdownMenuItem>
										</DropdownMenuGroup>
									</DropdownMenuContent>
								</DropdownMenu>
							</TableCell>
						</TableRow>
					)}
				/>
			</TableBody>
		</Table>
	);
};
