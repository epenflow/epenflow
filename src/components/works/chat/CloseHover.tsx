'use client';
import React from 'react';
import Image from 'next/image';
import epen from '/public/epen.png';
import useMouse from '@/utils/hooks/useMouse';
import { gsap } from 'gsap';
import { BrowserView } from 'react-device-detect';
import Desktop from '@/components/views/Desktop';
export const CloseHover = ({
	previusRef,
}: {
	previusRef: React.RefObject<HTMLSpanElement>;
}) => {
	const { mouseX, mouseY } = useMouse();
	const hoverRef = React.useRef<HTMLDivElement>(null);
	React.useLayoutEffect(() => {
		const hoverAnimations = gsap.fromTo(
			hoverRef.current,
			{
				opacity: 0,
				scale: 0,
				yPercent: -100,
				stagger: {
					amount: 1,
					each: 1,
				},
				visibility: 'none',
			},
			{
				opacity: 1,
				paused: true,
				scale: 1,
				yPercent: 0,
				visibility: 'block',
			}
		);
		previusRef.current?.addEventListener('mouseenter', () =>
			hoverAnimations.play()
		);
		previusRef.current?.addEventListener('mouseleave', () =>
			hoverAnimations.reverse()
		);
	}, []);
	return (
		<div
			className='bg-blue-600 h-52 w-52 z-50 hidden md:flex sm:flex fixed border-solid border-2 border-white justify-center '
			style={{ left: mouseX + 20, top: mouseY + 20 }}
			ref={hoverRef}>
			<Image
				src={epen.src}
				width={208}
				height={208}
				alt='epen flow'
				style={{ objectFit: 'contain' }}
			/>
		</div>
	);
};
