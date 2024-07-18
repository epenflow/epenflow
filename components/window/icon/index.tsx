'use client';
import React from 'react';
declare module '*.svg' {
	export const ReactComponent: React.FunctionComponent<
		React.SVGProps<SVGSVGElement>
	>;
}
export const __iconStyle__: Icons = {
	viewBox: '0 0 10 10',
	className: 'h-3 w-3 fill-black',
};
export interface Icons extends React.SVGProps<SVGSVGElement> {}
export const Maximize: React.FC<Icons> = ({ className, ...rest }) => {
	return (
		<svg {...rest} {...__iconStyle__}>
			<path d="M5,10c0,0 0,-2.744 0,-4.167c0,-0.221 -0.088,-0.433 -0.244,-0.589c-0.156,-0.156 -0.368,-0.244 -0.589,-0.244c-1.423,0 -4.167,0 -4.167,0l5,5Z" />
			<path d="M5,0c0,0 0,2.744 0,4.167c0,0.221 0.088,0.433 0.244,0.589c0.156,0.156 0.368,0.244 0.589,0.244c1.423,0 4.167,0 4.167,0l-5,-5Z" />
		</svg>
	);
};
export const Fullscreen: React.FC<Icons> = ({ className, ...rest }) => {
	return (
		<svg {...rest} {...__iconStyle__}>
			<path d="M2,3c0,0 0,2.744 0,4.167c0,0.221 0.088,0.433 0.244,0.589c0.156,0.156 0.368,0.244 0.589,0.244c1.423,0 4.167,0 4.167,0l-5,-5Z" />
			<path d="M8,7c0,0 0,-2.744 0,-4.167c0,-0.221 -0.088,-0.433 -0.244,-0.589c-0.156,-0.156 -0.368,-0.244 -0.589,-0.244c-1.423,0 -4.167,0 -4.167,0l5,5Z" />
		</svg>
	);
};
export const Minimize: React.FC<Icons> = ({ className, ...rest }) => {
	return (
		<svg {...rest} {...__iconStyle__}>
			<rect width="10.2" height="1" />
		</svg>
	);
};
export const Close: React.FC<Icons> = ({ className, ...rest }) => {
	return (
		<svg {...rest} {...__iconStyle__}>
			<polygon points="10.2,0.7 9.5,0 5.1,4.4 0.7,0 0,0.7 4.4,5.1 0,9.5 0.7,10.2 5.1,5.8 9.5,10.2 10.2,9.5 5.8,5.1 " />
		</svg>
	);
};
