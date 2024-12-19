import React from "react";

const FuckTheWorld: React.FC<{ id: string }> = ({ id }) => {
	return (
		<div>
			<h1>{id}</h1>
		</div>
	);
};
export default React.memo(FuckTheWorld);
