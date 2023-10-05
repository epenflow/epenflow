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
	const handleWhereMouse = (event: MouseEvent) => {
		setMouse((prev) => ({ ...prev, x: event.clientX, y: event.clientY }));
	};
	React.useEffect(() => {
		const rect = eyeRef.current?.getBoundingClientRect();
		window.addEventListener('mousemove', (event) => {
			handleWhereMouse(event);
			setEyePosition((prev) => ({
				...prev,
				x: rect?.x,
				y: rect?.y,
			}));
		});
		return () => {
			window.removeEventListener('mousemove', handleWhereMouse);
		};
	}, [whereMouse, eyePosition]);
	return (
		<div className='flex flex-row w-auto'>
			{Array.from({ length: 2 }).map((_, index) => (
				<Image
					key={index}
					src={eyeballs.src}
					width={50}
					height={50}
					alt='eyeball'
					style={{
						transform: `rotate(${
							360 -
							Math.atan2(
								whereMouse.x - eyePosition.x,
								whereMouse.y - eyePosition.y
							)
						}rad)`,
						objectFit: 'contain',
					}}
					ref={eyeRef}
				/>
			))}
		</div>
	);
};
export default Eye;
