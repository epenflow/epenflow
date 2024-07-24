'use client';

import { Mapping } from '@/components/Mapping';
import { TableCell, TableRow } from '@/components/ui/table';
import { CoreInstance, flexRender } from '@tanstack/react-table';

interface ColumnCellProps<T> {
	data: CoreInstance<T>;
}
export const ColumnCell = <T,>({ data }: ColumnCellProps<T>) => {
	return (
		<Mapping
			items={data.getRowModel().rows}
			render={(rows) => (
				<TableRow key={rows.id}>
					<Mapping
						items={rows.getVisibleCells()}
						render={(cell) => (
							<TableCell>
								{flexRender(
									cell.column.columnDef.cell,
									cell.getContext(),
								)}
							</TableCell>
						)}
					/>
				</TableRow>
			)}
		/>
	);
};
