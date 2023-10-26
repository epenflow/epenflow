'use client';

import React from 'react';
import tw, { TwStyle, styled } from 'twin.macro';
import EFLogoEffect from './effect/EFLogoEffect';
import { type } from 'os';
interface IEFLogo {
	size: TwStyle;
	color: string;
	zIndex: number;
}
const EFLogoWrapper = styled.svg<Partial<IEFLogo>>`
	width: ${(props) => props.size};
	path {
		fill: ${(props) => props.color};
	}
	position: absolute;
	z-index: ${(props) => props.zIndex};
`;

const EFLogo: React.FC<Partial<IEFLogo>> = ({
	size = tw`w-[20px]`,
	color = 'white',
	zIndex = 0,
}): JSX.Element => {
	const pathOne = React.useRef<SVGPathElement>(null);
	const pathTwo = React.useRef<SVGPathElement>(null);
	const pathThree = React.useRef<SVGPathElement>(null);
	const pathFour = React.useRef<SVGPathElement>(null);
	const pathFive = React.useRef<SVGPathElement>(null);
	const pathSix = React.useRef<SVGPathElement>(null);
	const pathSeven = React.useRef<SVGPathElement>(null);
	const pathRef = React.useRef<SVGSVGElement>(null);
	return (
		<EFLogoEffect
			pathOne={pathOne}
			pathTwo={pathTwo}
			pathThree={pathThree}
			pathFour={pathFour}
			pathFive={pathFive}
			pathSix={pathSix}
			pathSeven={pathSeven}
			pathRef={pathRef}>
			<EFLogoWrapper
				viewBox='0 0 1000 1000'
				size={size}
				color={color}
				ref={pathRef}>
				<defs></defs>
				<path
					ref={pathOne}
					d='M200,100V240c0-22.09,17.91-40,40-40h20c22.09,0,40,17.91,40,40v20c0,7.28-1.95,14.11-5.35,20h105.35V100H200Z'
				/>
				<path
					ref={pathTwo}
					d='M620,100v105.35c5.89-3.4,12.72-5.35,20-5.35h120c22.09,0,40,17.91,40,40V100h-180Z'
				/>
				<path
					ref={pathThree}
					d='M460,200c22.09,0,40,17.91,40,40v20c0,7.28-1.95,14.11-5.35,20h105.35V100h-180v105.35c5.89-3.4,12.72-5.35,20-5.35h20Z'
				/>
				<path
					ref={pathFour}
					d='M760,800H440c-7.28,0-14.11-1.95-20-5.35v105.35h380v-140c0,22.09-17.91,40-40,40Z'
				/>
				<path
					ref={pathFive}
					d='M200,300v140c0-22.09,17.91-40,40-40h20c22.09,0,40,17.91,40,40v320c0,22.09-17.91,40-40,40h-20c-22.09,0-40-17.91-40-40v140h200V300H200Z'
				/>
				<path
					ref={pathSix}
					d='M620,405.35c5.89-3.4,12.72-5.35,20-5.35h120c22.09,0,40,17.91,40,40v-140h-180v105.35Z'
				/>
				<path
					ref={pathSeven}
					d='M460,400c22.09,0,40,17.91,40,40v220c0,22.09-17.91,40-40,40h180c-7.28,0-14.11-1.95-20-5.35-11.96-6.92-20-19.85-20-34.65V300h-180v105.35c5.89-3.4,12.72-5.35,20-5.35h20Z'
				/>
			</EFLogoWrapper>
		</EFLogoEffect>
	);
};
export default EFLogo;
