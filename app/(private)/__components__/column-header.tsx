'use client';

import { ColumnResize } from '@/app/(private)/__components__/column-resize';
import { Mapping } from '@/components/Mapping';
import { TableHead, TableRow } from '@/components/ui/table';
import { flexRender, Table } from '@tanstack/react-table';
import React from 'react';

interface ColumnHeaderProps<T> {
	data: Table<T>;
}
export const ColumnHeader = <T,>({ data }: ColumnHeaderProps<T>) => {
	return (
		<Mapping
			items={data.getHeaderGroups()}
			render={(headerGroups) => (
				<TableRow key={headerGroups.id}>
					<Mapping
						items={headerGroups.headers}
						render={(header) => (
							<TableHead
								style={{ width: header.getSize() }}
								className="relative border"
							>
								{header.isPlaceholder
									? null
									: flexRender(
											header.column.columnDef.header,
											header.getContext(),
										)}

								<ColumnResize header={header} />
							</TableHead>
						)}
					/>
				</TableRow>
			)}
		/>
	);
};
