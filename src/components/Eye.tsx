'use client';
import React from 'react';
import eyeballs from '/public/eyeballs.svg';
import Image from 'next/image';
type TWhereMouse = {
	x: number;
	y: number;
};
const Eye = () => {
	const [whereMouse, setMouse] = React.useState<TWhereMouse>({ x: 0, y: 0 });
	const [eyePosition, setEyePosition] = React.useState<TWhereMouse>({
		x: 0,
		y: 0,
	});
	const eyeRef = React.useRef<HTMLImageElement>(null);
	const eyeContainerRef = React.useRef<HTMLDivElement>(null);
	const angle = Math.atan2(
		whereMouse.y - eyePosition.y,
		whereMouse.x - whereMouse.y
	);
	const handleWhereMouse = (event: MouseEvent) => {
		setMouse((prev) => ({ ...prev, x: event.clientX, y: event.clientY }));
	};
	React.useEffect(() => {
		const rect = eyeRef.current?.getBoundingClientRect();
		const xRect = rect?.left === undefined ? 0 : rect?.left;
		const yRect = rect?.top === undefined ? 0 : rect?.top;

		window.addEventListener('mousemove', (event) => {
			handleWhereMouse(event);
			setEyePosition((prev) => ({
				...prev,
				x: xRect,
				y: yRect,
			}));
		});
		return () => {
			window.removeEventListener('mousemove', handleWhereMouse);
		};
	}, [whereMouse, eyePosition]);
	return (
		<div
			className='flex flex-row w-auto'
			ref={eyeContainerRef}>
			{Array.from({ length: 2 }).map((_, index) => (
				<Image
					key={index}
					src={eyeballs.src}
					width={50}
					height={50}
					alt='eyeball'
					style={{
						transform: `rotate(${360 - angle * 57.29}rad)`,
						objectFit: 'contain',
						transformOrigin: 'center center',
					}}
					ref={eyeRef}
				/>
			))}
		</div>
	);
};
export default Eye;
