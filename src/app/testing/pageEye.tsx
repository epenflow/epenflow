'use client';
import React from 'react';
import eyeballs from '/public/eyeballs.svg';
import Image from 'next/image';
import { styled } from 'twin.macro';
type TPos = {
	x: number;
	y: number;
};
type TEyeWrapper = {
	rotasi: number;
};
const EyeWrapper = styled.div<TEyeWrapper>`
	position: relative;
	height: 50px;
	width: 50px;
	border: solid 2px black;
	border-radius: 50%;
	background-color: white;
	display: inline-block;
	transform: rotate(${(props) => props.rotasi}deg);
	-ms-transform: rotate(${(props) => props.rotasi}deg);
	-moz-transform: rotate(${(props) => props.rotasi}deg);
	-webkit-transform: rotate(${(props) => props.rotasi}deg);

	::after {
		content: '';
		width: 25px;
		height: 25px;
		background-color: black;
		border-radius: 50%;
		position: absolute;
		left: 10px;
		top: 5px;
	}
`;

const Page = () => {
	const eyeRef = React.useRef<HTMLDivElement>(null);
	const containerRef = React.useRef<HTMLDivElement>(null);
	const [mouseCoord, setMouseCoord] = React.useState<TPos>({ x: 0, y: 0 });
	const handleMove = (event: MouseEvent) => {
		setMouseCoord((prev) => ({
			...prev,
			x: event.clientX,
			y: event.clientY,
		}));
	};
	const rotasi = (element: React.RefObject<HTMLDivElement>) => {
		const rectX: number =
			element.current?.offsetLeft ||
			0 + (element.current?.clientWidth || 0) / 2;

		const rectY: number =
			element.current?.offsetTop ||
			0 + (element.current?.clientHeight || 0) / 2;

		const x = rectX - mouseCoord.x;
		const y = rectY - mouseCoord.y;
		const rad = Math.atan2(x, y);
		const rot = ((rad * 180) / Math.PI) * -1;
		console.info(rot);
		return rot;
	};
	React.useEffect(() => {
		window.addEventListener('mousemove', handleMove);
		return () => {};
		window.removeEventListener('mousemove', handleMove);
	}, []);

	return (
		<div className='w-full flex h-screen items-center justify-center p-56'>
			<div
				className='w-full'
				ref={eyeRef}>
				<EyeWrapper rotasi={rotasi(eyeRef)} />
				<EyeWrapper rotasi={rotasi(eyeRef)} />
			</div>
		</div>
	);
};
export default Page;
