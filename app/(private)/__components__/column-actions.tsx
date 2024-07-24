import { ModalPortal } from '@/app/(private)/__components__/modal-portal';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useFeedback } from '@/lib/hooks/use-feedback';
import {
	DotsHorizontalIcon,
	Pencil2Icon,
	TrashIcon,
} from '@radix-ui/react-icons';
import React from 'react';
interface ColumnActionsProps {
	children: React.ReactNode;
	handleEdit: () => void;
	handleDelete: () => void;
}
export const ColumnActions = ({
	children,
	handleDelete,
	handleEdit,
}: ColumnActionsProps) => {
	const [isModal, setModal] = React.useState<boolean>(false);
	const { feedback } = useFeedback();
	const iconStyle = 'h-5 w-5';
	function _handleEdit() {
		setModal((prev) => !prev);
		handleEdit();
	}

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
							onClick={_handleEdit}
						>
							<Pencil2Icon className={iconStyle} />
							<span>Edit</span>
						</DropdownMenuItem>
						<DropdownMenuItem
							className="space-x-2.5"
							onClick={handleDelete}
						>
							<TrashIcon className={iconStyle} />
							<span>Delete</span>
						</DropdownMenuItem>
					</DropdownMenuGroup>
				</DropdownMenuContent>
			</DropdownMenu>
			<ModalPortal condition={isModal}>
				<Dialog open={isModal} onOpenChange={_handleEdit}>
					<DialogContent>{children}</DialogContent>
				</Dialog>
			</ModalPortal>
		</React.Fragment>
	);
};
