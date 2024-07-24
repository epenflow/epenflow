'use client';
import React from 'react';
import {
	Table,
	TableBody,
	TableFooter,
	TableHeader,
} from '@/components/ui/table';
import { formatDates } from '@/lib/format-dates';
import { Project } from '@prisma/client';
import {
	ColumnResizeDirection,
	ColumnResizeMode,
	createColumnHelper,
	getCoreRowModel,
	getPaginationRowModel,
	useReactTable,
} from '@tanstack/react-table';
import { ColumnCell } from '@/app/(private)/__components__/column-cell';
import { ColumnHeader } from '@/app/(private)/__components__/column-header';
import { TablePagination } from '@/app/(private)/__components__/table-pagination';
import { ColumnActions } from '@/app/(private)/__components__/column-actions';
import {
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog';
import { ProjectFormEdit } from '@/app/(private)/__components__/project-form-edit';
import { ColumnSelect } from '@/app/(private)/__components__/column-select';
import { ProjectActions } from '@/app/(private)/__components__/project-action';
interface ProjectTableProps {
	projects: Project[];
}
const columnHelper = createColumnHelper<Project>();
const columns = [
	columnHelper.display({
		id: 'Project--No',
		header: 'Project--No',
		cell: (props) => props.row.index + 1,
		size: 115,
	}),
	columnHelper.accessor('projectName', {
		header: 'Project--Name',
		id: 'Project--Name',
		cell: (props) => props.getValue(),
		size: 220,
	}),
	columnHelper.accessor('createdAt', {
		id: 'Project--Created/AT',
		header: 'Project--Created/AT',
		cell: (props) => formatDates(props.getValue()),
	}),
	columnHelper.accessor('modifiedAt', {
		id: 'Project--Modified/AT',
		header: 'Project--Modified/AT',
		cell: (props) => formatDates(props.getValue()),
	}),
	columnHelper.display({
		id: 'Project--Actions',
		header: 'Project--Actions',
		enableHiding: true,
		cell: (props) => (
			<ProjectActions
				data={props}
				getId={(row) => row.projectId}
				getName={(row) => row.projectName}
			/>
		),
	}),
];
export const ProjectTable: React.FC<ProjectTableProps> = ({ projects }) => {
	const [columnResizeMode, setColumnResizeMode] =
		React.useState<ColumnResizeMode>('onChange');
	const [columnResizeDirection, setColumnResizeDirection] =
		React.useState<ColumnResizeDirection>('ltr');
	const [columnVisibility, setColumnVisibility] = React.useState({});
	const table = useReactTable({
		data: projects,
		columns: columns,
		state: {
			columnVisibility: columnVisibility,
		},
		onColumnVisibilityChange: setColumnVisibility,
		//
		columnResizeMode,
		columnResizeDirection,
		//
		getCoreRowModel: getCoreRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		//
		debugTable: true,
		debugHeaders: true,
		debugColumns: true,
		initialState: {
			pagination: {
				pageSize: 10,
			},
		},
		defaultColumn: {
			size: 200,
			minSize: 90,
			maxSize: 500,
		},
	});
	return (
		<React.Fragment>
			<ColumnSelect data={table} />
			<Table style={{ width: table.getTotalSize() }}>
				<TableHeader>
					<ColumnHeader data={table} />
				</TableHeader>
				<TableBody>
					<ColumnCell data={table} />
				</TableBody>
			</Table>
			<TablePagination data={table} />
		</React.Fragment>
	);
};
