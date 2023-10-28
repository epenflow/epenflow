'use client';
import useClient from '@/utils/hooks/useClient';
import React from 'react';
import { isDesktop } from 'react-device-detect';

const Desktop = ({ children }: { children: React.ReactNode }) => {
	const isClient = useClient();
	return isClient ? (
		isDesktop ? (
			<React.Fragment>{children}</React.Fragment>
		) : null
	) : null;
};

export default Desktop;
