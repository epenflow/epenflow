"use client";
import directory from "@/contexts/process/directory";
import List from "@/utils/list";
import React from "react";

const Desktop = () => {
	return (
		<>
			<List list={Object.entries(directory)}>
				{([id, { Component }]) => <Component id={id} key={id} />}
			</List>
		</>
	);
};
export default React.memo(Desktop);
