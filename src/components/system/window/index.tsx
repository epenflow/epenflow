import dynamic from "next/dynamic";
import type React from "react";

const Window: React.FC<React.ComponentProps<"div">> = ({ ...rest }) => {
	return <div {...rest} />;
};
export default dynamic(() => Promise.resolve(Window));
