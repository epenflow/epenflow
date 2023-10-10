'use client';
import React from 'react';

const Locomotive = ({ children }: { children: React.ReactNode }) => {
	React.useEffect(() => {
		(async () => {
			const LocomotiveScroll = (await import('locomotive-scroll'))
				.default;
			const locomotiveScroll = new LocomotiveScroll({});
			locomotiveScroll.start();
		})();
	}, []);
	return children;
};

export default Locomotive;
