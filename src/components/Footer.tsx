import React from 'react';
import Link from 'next/link';
const Footer = () => {
	return (
		<footer className='fixed bottom-0 flex justify-center items-center w-screen bg-black p-2'>
			<Link
				href={'mailto:epenflow@gmail.com'}
				className='uppercase font-bold'>
				epenflow©2023
			</Link>
		</footer>
	);
};

export default Footer;
