'use client';
import React from 'react';

export function useProgramTrigger() {
	const [isMaximize, setMaximize] = React.useState<boolean>(false);
	const [isMinimize, setMinimize] = React.useState<boolean>(false);
	const [isClose, setClose] = React.useState<boolean>(false);
	const fnMaximize = React.useCallback(() => {
		if (isMinimize) {
			return setMinimize((prev) => !prev);
		}
		setMaximize((prev) => !prev);
	}, [isMinimize, setMaximize, setMinimize]);
	const fnMinimize = React.useCallback(() => {
		if (isMaximize) {
			setMaximize((prev) => !prev);
		}
		setMinimize((prev) => !prev);
	}, [isMaximize, setMaximize, setMinimize]);
	const fnClose = React.useCallback(() => {
		setClose((prev) => !prev);
	}, [setClose]);

	return { isClose, isMaximize, isMinimize, fnClose, fnMaximize, fnMinimize };
}
