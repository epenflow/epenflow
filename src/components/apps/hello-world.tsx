import React from "react";

const HelloWorld: React.FC<{ id: string }> = ({ id }) => {
	return (
		<div>
			<h1>{id}</h1>
		</div>
	);
};

export default React.memo(HelloWorld);
