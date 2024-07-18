import React from 'react';

interface CautionProps extends React.HTMLAttributes<HTMLDivElement> {}
export const Caution = () => {
	return (
		<div className="m-2 flex w-fit flex-col justify-between space-y-1 bg-[#f7d417] p-2.5 font-bold">
			<h1 className="bg-black text-center text-3xl text-[#f7d417] lg:text-6xl">
				CAUTION
			</h1>
			<p className="text-center text-3xl lg:text-5xl">
				CONSTRUCTION
				<br /> AREA
				<br /> AUTHORIZED
				<br /> PERSONNEL ONLY
			</p>
			<p className="text-center text-xs">
				THIS NEW SITE IS UNDERGOING CONSTRUCTION,
				<br /> PLEASE BE CAREFUL IF THERE IS SUSPICIOUS ACTIVITY
			</p>
		</div>
	);
};
