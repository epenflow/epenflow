'use client';
import React from 'react';
import { useDragControls, motion } from 'framer-motion';
import useMouse from '@/utils/hooks/useMouse';
import Pointer from '@/components/Pointer';
const Page = () => {
	const controls = useDragControls();
	const { mouseX, mouseY } = useMouse();
	return (
		<>
			<Pointer />
			<div className='flex items-center justify-center w-full h-screen'>
				<div className='bg-blue-500 p-2 relative'>
					<motion.div
						dragControls={controls}
						drag
						className='bg-white h-20 w-20 m-20'
					/>
				</div>
			</div>
		</>
	);
};

export default Page;
