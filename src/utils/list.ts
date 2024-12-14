import React from "react";
import dynamic from "next/dynamic";

interface ListProps<T> {
	list?: T[];
	children: (item: T, index: number) => React.ReactNode;
}
function List<T>({ list, children }: ListProps<T>) {
	if (!Array.isArray(list)) {
		throw new Error(
			`Expected an array for "list" props, but received a ${typeof list}`
		);
	}

	return React.Children.toArray(
		list?.map((item: T, index: number) => children(item, index))
	);
}
export default dynamic(() => Promise.resolve(React.memo(List))) as typeof List;
