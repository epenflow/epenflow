'use client';
import { CellContext, Table } from '@tanstack/react-table';
import React from 'react';
import {
	DotsHorizontalIcon,
	Pencil2Icon,
	TrashIcon,
} from '@radix-ui/react-icons';
import {
	DropdownMenu,
	DropdownMenuTrigger,
	DropdownMenuContent,
	DropdownMenuLabel,
	DropdownMenuGroup,
	DropdownMenuSeparator,
	DropdownMenuItem,
} from '@/components/ui/dropdown-menu';
import { ModalPortal } from '@/app/(private)/__components__/modal-portal';
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog';
import { ProjectFormEdit } from '@/app/(private)/__components__/project-form-edit';
import { DialogDescription } from '@radix-ui/react-dialog';
interface ProjectActionsProps<T, V> {
	data: CellContext<T, V>;
	getId: (row: T) => string;
	getName: (name: T) => string;
}
export const ProjectActions = <T, V>({
	data,
	getId,
	getName,
}: ProjectActionsProps<T, V>) => {
	const iconStyle = 'h-5 w-5';
	const id = getId(data.row.original);
	const name = getName(data.row.original);
	const [isModal, setModal] = React.useState<boolean>(false);
	function handleEdit() {
		console.log(id, name);
		setModal((prev) => !prev);
	}
	function handleDelete() {}
	return (
		<React.Fragment>
			<DropdownMenu>
				<DropdownMenuTrigger>
					<DotsHorizontalIcon className={iconStyle} />
				</DropdownMenuTrigger>
				<DropdownMenuContent align="end">
					<DropdownMenuLabel>Menu</DropdownMenuLabel>
					<DropdownMenuSeparator />
					<DropdownMenuGroup>
						<DropdownMenuItem
							className="space-x-2.5"
							onClick={handleEdit}
						>
							<Pencil2Icon className={iconStyle} />
							<span>Edit</span>
						</DropdownMenuItem>
						<DropdownMenuItem className="space-x-2.5">
							<TrashIcon className={iconStyle} />
							<span>Delete</span>
						</DropdownMenuItem>
					</DropdownMenuGroup>
				</DropdownMenuContent>
			</DropdownMenu>
			<ModalPortal condition={isModal}>
				<Dialog open={isModal} onOpenChange={handleEdit}>
					<DialogContent>
						<DialogHeader>
							<DialogTitle>{name}</DialogTitle>
							<DialogDescription>{id}</DialogDescription>
						</DialogHeader>
						<ProjectFormEdit
							_handleEdit={handleEdit}
							projectId={id}
							projectName={name}
						/>
					</DialogContent>
				</Dialog>
			</ModalPortal>
		</React.Fragment>
	);
};
