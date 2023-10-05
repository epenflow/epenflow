'use client';
import { COLOR_PALETTE } from '@/constants/color';
import { Next13ProgressBar } from 'next13-progressbar';
import React from 'react';

const ProgressBar = () => {
	return (
		<Next13ProgressBar
			options={{ showSpinner: false }}
			color={`${COLOR_PALETTE.neon}`}
			height={`5px`}
		/>
	);
};

export default ProgressBar;
