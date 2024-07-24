'use client';
import React from 'react';
import { Mapping } from '@/components/Mapping';
import { Button } from '@/components/ui/button';
import {
	DropdownMenu,
	DropdownMenuCheckboxItem,
	DropdownMenuContent,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MixerHorizontalIcon } from '@radix-ui/react-icons';
import { Table } from '@tanstack/react-table';

interface ColumnSelectProps<T> {
	data: Table<T>;
}

export const ColumnSelect = <T,>({ data }: ColumnSelectProps<T>) => {
	console.log(data.getIsAllColumnsVisible());
	return (
		<DropdownMenu modal={false}>
			<DropdownMenuTrigger asChild>
				<Button
					variant="outline"
					size="sm"
					className="ml-auto h-8 space-x-2 lg:flex"
				>
					<MixerHorizontalIcon className="h-4 w-4" />
					Select columns
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end" className="w-[150px]">
				<DropdownMenuLabel>Columns</DropdownMenuLabel>
				<DropdownMenuSeparator />
				<Mapping
					items={data.getAllColumns()}
					render={(column) => (
						<DropdownMenuCheckboxItem
							key={column.id}
							checked={column.getIsVisible()}
							onCheckedChange={(value) =>
								column.toggleVisibility(!!value)
							}
						>
							{column.id}
						</DropdownMenuCheckboxItem>
					)}
				/>
			</DropdownMenuContent>
		</DropdownMenu>
	);
};
