import { DragHandleDots2Icon } from '@radix-ui/react-icons';
import { Header, Table } from '@tanstack/react-table';

interface ColumnResizeProps<T> {
	header: Header<T, unknown>;
}
export const ColumnResize = <T,>({ header }: ColumnResizeProps<T>) => {
	return (
		<div
			{...{
				onMouseDown: header.getResizeHandler(),
				onTouchStart: header.getResizeHandler(),
				style: {
					userSelect: 'none',
					touchAction: 'none',
				},
			}}
			className="absolute right-0 top-0 h-full"
		>
			<DragHandleDots2Icon className="absolute left-1/2 top-1/2 h-5 w-5 -translate-x-1/2 -translate-y-1/2 hover:cursor-e-resize" />
		</div>
	);
};
