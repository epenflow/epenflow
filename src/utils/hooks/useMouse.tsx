'use client';
import React from 'react';
type TPosition = {
	x: number;
	y: number;
};
export default function useMouse(): {
	mouseX: number;
	mouseY: number;
} {
	const [position, setPosition] = React.useState<TPosition>({ x: 0, y: 0 });
	React.useEffect(() => {
		window.addEventListener('mousemove', (event) =>
			setPosition((prev) => ({
				...prev,
				x: event.clientX,
				y: event.clientY,
			}))
		);
		return () =>
			window.removeEventListener('mousemove', () =>
				setPosition((prev) => ({ ...prev, x: 0, y: 0 }))
			);
	}, [position]);
	return { mouseX: position.x, mouseY: position.y };
}
