'use client';
import React from 'react';
import eyeballs from '/public/eyeballs.svg';
type TWhereMouse = {
	x: number;
	y: number;
};
export default function Page() {
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
				y: rect?.top,
			}));
		});
		return () => {
			window.removeEventListener('mousemove', handleWhereMouse);
		};
	}, [whereMouse]);
	return (
		<div className='relative flex justify-center items-center rounded-full'>
			<p>
				x: {eyePosition.x.toFixed()}
				<br />
				top: {eyePosition.y.toFixed()}
			</p>
			<p>x mouse:{whereMouse.x}</p>
			{Array.from({ length: 2 }).map((_, index) => (
				<img
					key={index}
					src={eyeballs.src}
					className='w-32 h-32 object-contain'
					style={{
						transformOrigin: 'center center',
						transform: `rotate(${
							360 -
							Math.atan2(
								whereMouse.y - eyePosition.y,
								whereMouse.x - eyePosition.x
							)
						}rad)`,
					}}
					ref={eyeRef}
				/>
			))}
		</div>
	);
}
