'use client';
import { Table } from '@tanstack/react-table';
import {
	ChevronRightIcon,
	ChevronLeftIcon,
	DoubleArrowLeftIcon,
	DoubleArrowRightIcon,
} from '@radix-ui/react-icons';
import React from 'react';
import { Button } from '@/components/ui/button';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { Mapping } from '@/components/Mapping';
interface TablePaginationProps<T> {
	data: Table<T>;
}

export const TablePagination = <T,>({ data }: TablePaginationProps<T>) => {
	const iconStyle = 'h-4 w-4';
	return (
		<div className="flex w-full flex-row items-center justify-between text-xs">
			<div className="flex flex-row items-center">
				<p className="w-full">Rows per page</p>
				<Select
					value={`${data.getState().pagination.pageSize}`}
					onValueChange={(value) => {
						data.setPageSize(Number(value));
					}}
				>
					<SelectTrigger>
						<SelectValue
							placeholder={data.getState().pagination.pageSize}
						/>
					</SelectTrigger>
					<SelectContent>
						<Mapping
							items={[10, 20, 30, 40, 50]}
							render={(pageSize) => (
								<SelectItem
									key={pageSize}
									value={`${pageSize}`}
								>
									{pageSize}
								</SelectItem>
							)}
						/>
					</SelectContent>
				</Select>
			</div>
			<div>
				Page {data.getState().pagination.pageIndex + 1} of{' '}
				{data.getPageCount()}
			</div>
			<div className="flex flex-row gap-2">
				<Button
					variant={'outline'}
					className="h-8 w-8 p-0 lg:flex"
					onClick={() => data.setPageIndex(0)}
					disabled={!data.getCanPreviousPage()}
				>
					<span className="sr-only">Go to first page</span>
					<DoubleArrowLeftIcon className={iconStyle} />
				</Button>
				<Button
					variant={'outline'}
					className="h-8 w-8 p-0 lg:flex"
					onClick={() => data.previousPage()}
					disabled={!data.getCanPreviousPage()}
				>
					<span className="sr-only">Go to previous page</span>
					<ChevronLeftIcon className={iconStyle} />
				</Button>
				<Button
					variant={'outline'}
					className="h-8 w-8 p-0 lg:flex"
					onClick={() => data.nextPage()}
					disabled={!data.getCanNextPage()}
				>
					<span className="sr-only">Go to next page</span>
					<ChevronRightIcon className={iconStyle} />
				</Button>
				<Button
					variant={'outline'}
					className="h-8 w-8 p-0 lg:flex"
					onClick={() => data.setPageIndex(data.getPageCount() - 1)}
					disabled={!data.getCanNextPage()}
				>
					<span className="sr-only">Go to last page</span>
					<DoubleArrowRightIcon className={iconStyle} />
				</Button>
			</div>
		</div>
	);
};
