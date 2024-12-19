"use client";
import Window from "@/components/system/window";
import directory from "@/contexts/process/directory";
import List from "@/utils/list";
import React from "react";

const Desktop = () => {
	return (
		<>
			<List list={Object.entries(directory)}>
				{([id, { Component, hasWindow }]) =>
					hasWindow ? (
						<Window>
							<Component key={id} id={id} />
						</Window>
					) : (
						<Component key={id} id={id} />
					)
				}
			</List>
		</>
	);
};
export default React.memo(Desktop);
