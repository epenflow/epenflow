"use client";
import Window from "@/components/system/window";
import directory from "@/contexts/process/directory";
import List from "@/utils/list";
import styled from "@emotion/styled";
import React from "react";

const DesktopWrapper = styled.main`
	background-color: transparent;
	contain: strict;
	height: 100%;
	inset: 0;
	overflow: hidden;
	overscroll-behavior: none;
	position: fixed;
	width: 100vw;
`;

const Desktop = () => {
	return (
		<DesktopWrapper>
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
		</DesktopWrapper>
	);
};
export default React.memo(Desktop);
