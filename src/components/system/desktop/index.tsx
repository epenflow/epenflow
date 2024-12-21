"use client";
import Window from "@/components/system/window";
import directory from "@/contexts/process/directory";
import List from "@/utils/list";
import React from "react";

const Desktop = () => {
	return (
		<>
			<List list={Object.entries(directory)}>
				{([id, { Component, hasWindow }]) => (
					<React.Fragment key={id}>
						{hasWindow ? (
							<Window>
								<Component id={id} />
							</Window>
						) : (
							<Component id={id} />
						)}
					</React.Fragment>
				)}
			</List>
		</>
	);
};
export default React.memo(Desktop);
