/**
 * @jsxImportSource @emotion/react
 */
'use client';
import tw from 'twin.macro';
import Link from 'next/link';
import React from 'react';
import { ImArrowDownRight2, ImArrowRight2 } from 'react-icons/im';

const Arrow = ({ to, text }: { to: string; text: string }) => {
	const [isOver, setOver] = React.useState<boolean>(false);
	return (
		<Link
			href={to}
			onMouseEnter={() => setOver((prev) => (prev = true))}
			onMouseLeave={() => setOver((prev) => (prev = false))}
			tw='flex flex-row items-center  relative text-xl justify-between'>
			{text}
			{isOver ? <ImArrowRight2 /> : <ImArrowDownRight2 />}
		</Link>
	);
};

export default Arrow;
