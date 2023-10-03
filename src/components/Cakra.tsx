'use client';
import { keyframes } from '@emotion/react';
import React from 'react';
import tw, { css, styled } from 'twin.macro';
import gsap, { Bounce } from 'gsap';
const CakraAnimations = keyframes`
	0%{
		transform: rotate(0deg);
	}
	100%{
		transform: rotate(360deg);
	}
`;
const CakraWrapper = styled.svg(tw`w-48 [fill: white]  animate-slow-spin`);
const Cakra = () => {
	const cakraRef = React.useRef<HTMLDivElement>(null);
	React.useLayoutEffect(() => {
		const tl = gsap.timeline({
			defaults: {
				duration: 5,
				ease: Bounce.easeInOut,
				stagger: {
					amount: 10,
					yoyo: true,
					yoyoEase: Bounce.easeInOut,
				},
			},
		});
		const ctx = gsap.context(() => {
			tl.fromTo(
				cakraRef.current,
				{
					xPercent: 50,
					overflow: 'none',
					visibility: 'none',
					scale: 0,
				},
				{
					xPercent: 0,
					overflow: 'none',
					visibility: 'block',
					scale: 1,
				}
			);
		});
		return () => {
			ctx.revert();
		};
	}, []);
	return (
		<div
			ref={cakraRef}
			className='overflow-y-hidden'>
			<CakraWrapper
				id='Layer_1'
				data-name='Layer 1'
				xmlns='http://www.w3.org/2000/svg'
				viewBox='0 0 938 936'>
				<path d='M548,0c18,33,31,67,42,103,19,60,31,121,32,184,59-26,111-64,155-114,1-1,3-2,4-3,10-11,19-22,27-34-2,10-3,20-5,30,0,2-2,3-2,5-16,86-48,158-95,232-2,3-5,5-7,9,79,15,162,11,239-13-34,32-67,63-109,88-3,2-6,5-9,7-43,26-86,48-132,64,55,59,125,103,201,130-46,8-93,9-140,8-9-1-19-1-28-2-43-4-85-12-127-24,3,42,15,83,31,123,15,35,32,70,55,100-89-45-168-110-229-189-8,16-16,33-24,49-1,2,0,3-1,5-12,28-21,57-27,88s-10,60-9,90c-18-33-31-67-42-103-19-60-31-121-32-184-59,26-111,64-155,114-1,1-3,2-4,3-10,11-19,22-27,34,2-10,3-20,5-30,0-2,2-3,2-5,16-86,48-158,95-232,2-3,5-5,7-9-79-15-162-11-239,13,34-32,67-63,109-88,3-2,6-5,9-7,43-26,86-48,132-64-55-59-125-103-201-130,46-8,93-9,140-8,9,1,19,1,28,2,43,4,85,12,127,24-3-42-15-83-31-123-15-35-32-70-55-100,89,45,168,110,229,189,8-16,16-33,24-49,1-2,0-3,1-5,12-28,21-57,27-88s10-60,9-90h0Z' />
			</CakraWrapper>
		</div>
	);
};

export default Cakra;
