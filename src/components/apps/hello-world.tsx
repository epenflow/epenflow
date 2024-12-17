import React from "react";

const HelloWorld: React.FC<{ id: string }> = () => {
	return <h1>Hello World</h1>;
};

export default React.memo(HelloWorld);
