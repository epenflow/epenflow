'use client';
import gsap, { Bounce } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import React from 'react';
interface IEFLogoEffect {
	children: JSX.Element;
	pathOne: React.RefObject<SVGPathElement>;
	pathTwo: React.RefObject<SVGPathElement>;
	pathThree: React.RefObject<SVGPathElement>;
	pathFour: React.RefObject<SVGPathElement>;
	pathFive: React.RefObject<SVGPathElement>;
	pathSix: React.RefObject<SVGPathElement>;
	pathSeven: React.RefObject<SVGPathElement>;
	pathRef: React.RefObject<SVGSVGElement>;
}
const EFLogoEffect: React.FC<IEFLogoEffect> = ({
	children,
	pathOne,
	pathTwo,
	pathThree,
	pathFour,
	pathFive,
	pathSix,
	pathSeven,
	pathRef,
}) => {
	React.useLayoutEffect(() => {
		const tl = gsap.timeline({
			defaults: {
				duration: 10,
				ease: Bounce.easeInOut,
				stagger: {
					amount: 1,
					yoyo: true,
					yoyoEase: Bounce.easeInOut,
				},
			},
		});
		// const scroll = gsap
		// 	.timeline()
		// 	.to(pathOne.current, { xPercent: -300 }, 6)
		// 	.to(pathTwo.current, { xPercent: 300 }, 6)
		// 	.to(pathThree.current, { yPercent: -300 }, 6)
		// 	.to(pathFour.current, { xPercent: 300 }, 6)
		// 	.to(pathFive.current, { yPercent: 300 }, 6)
		// 	.to(pathSix.current, { xPercent: 300 }, 6)
		// 	.to(pathSeven.current, { yPercent: 300 }, 0);
		let ctx = gsap.context(() => {
			tl.fromTo(
				pathOne.current,
				{
					xPercent: -300,
				},
				{
					xPercent: 0,
				},
				6
			)
				.fromTo(
					pathTwo.current,
					{
						xPercent: 300,
					},
					{
						xPercent: 0,
					},
					6
				)
				.fromTo(
					pathThree.current,
					{
						yPercent: -300,
					},
					{
						yPercent: 0,
					},
					6
				)
				.fromTo(
					pathFour.current,
					{
						xPercent: 300,
					},
					{
						xPercent: 0,
					},
					6
				)
				.fromTo(
					pathFive.current,
					{
						yPercent: 300,
					},
					{
						yPercent: 0,
					},
					6
				)
				.fromTo(
					pathSix.current,
					{
						xPercent: 300,
					},
					{
						xPercent: 0,
					},
					6
				)
				.fromTo(
					pathSeven.current,
					{
						yPercent: 300,
						scale: 2.5,
						autoAlpha: 0,
					},
					{
						yPercent: 0,
						scale: 1,
						autoAlpha: 1,
					},
					0
				)
				.fromTo(
					pathRef.current,
					{
						rotate: 360,
					},
					{
						rotate: 0,
					},
					3
				)
				.to(
					pathRef.current,
					{
						opacity: '50%',
					},
					7
				);
		});
		return () => {
			ctx.revert();
		};
	}, []);
	return children;
};

export default EFLogoEffect;
