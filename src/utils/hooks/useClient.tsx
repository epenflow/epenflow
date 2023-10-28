'use client';
import React from 'react';

const useClient = (): boolean => {
	const [isClient, setClient] = React.useState<boolean>(false);
	React.useEffect(() => setClient((prev) => (prev = true)), []);
	return isClient;
};

export default useClient;
