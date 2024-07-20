import React from 'react';

interface MappingProps<K> {
	items: K[];
	render: (item: K, index: number) => React.ReactNode;
}
export const Mapping = <K,>({
	items,
	render,
}: MappingProps<K>): React.ReactNode => {
	return React.Children.toArray(
		items.map((item, index) => render(item, index)),
	);
};
