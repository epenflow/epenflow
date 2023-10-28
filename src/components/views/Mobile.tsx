'use client';
import useClient from '@/utils/hooks/useClient';
import React from 'react';
import { isMobile } from 'react-device-detect';

export const Mobile = ({ children }: { children: React.ReactNode }) => {
	const isClient = useClient();
	return isClient ? (
		isMobile ? (
			<React.Fragment>{children}</React.Fragment>
		) : null
	) : null;
};
