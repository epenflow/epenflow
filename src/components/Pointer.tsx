'use client';
import useMouse from '@/utils/hooks/useMouse';
import React from 'react';
import { motion } from 'framer-motion';
import { styled } from 'twin.macro';
import { isMobile, isDesktop, BrowserView } from 'react-device-detect';

const PointerWrapper = styled(motion.div)`
	height: 25px;
	width: 25px;
	background-color: rgb(37 99 235 / var(--tw-bg-opacity));
	border-radius: 50%;
	position: fixed;
	display: flex;
	justify-content: center;
	align-items: center;
	border: solid 2px white;
	::before {
		width: 10px;
		height: 10px;
		background-color: white;
		content: '';
		display: inline-block;
		border-radius: 50%;
	}
`;
const Pointer = () => {
	const { mouseX, mouseY } = useMouse();
	return (
		<BrowserView>
			<PointerWrapper
				animate={{
					x: mouseX + 10,
					y: mouseY + 5,
					zIndex: 99999,
				}}
				transition={{
					type: 'spring',
					damping: 5,
					stiffness: 55,
					restDelta: 0.001,
				}}></PointerWrapper>
		</BrowserView>
	);
};

export default Pointer;
