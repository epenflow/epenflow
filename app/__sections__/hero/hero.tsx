'use client';
import * as Scrollytelling from '@bsmnt/scrollytelling';
import Link from 'next/link';
export const Hero = () => {
	return (
		<>
			<Scrollytelling.Root>
				<Scrollytelling.Pin
					childHeight={100}
					pinSpacerHeight={'150vh'}
					top={0}
				>
					<section className="h-screen w-screen overflow-hidden bg-black text-white">
						<div className="wrapper">
							<h1>Layered pinning 1</h1>
						</div>
					</section>
				</Scrollytelling.Pin>
			</Scrollytelling.Root>

			<Scrollytelling.Root>
				<Scrollytelling.Pin
					childHeight={100}
					pinSpacerHeight={'150vh'}
					top={0}
				>
					<section className="h-screen w-screen overflow-hidden bg-orange-600">
						<div className="wrapper">
							<h1>Layered pinning 2</h1>
						</div>
					</section>
				</Scrollytelling.Pin>
			</Scrollytelling.Root>

			<Scrollytelling.Root debug={{ label: 'layered pining 3' }}>
				<Scrollytelling.Pin
					childHeight={100}
					pinSpacerHeight={'150vh'}
					top={0}
				>
					<Scrollytelling.Animation
						tween={{
							start: 50,
							end: 100,
							to: {
								borderRadius: '0%',
							},
						}}
					>
						<section className="h-screen w-screen overflow-hidden rounded-t-[25%] bg-black text-white">
							<div className="wrapper">
								<h1>Layered pinning 3</h1>
							</div>
						</section>
					</Scrollytelling.Animation>
				</Scrollytelling.Pin>
			</Scrollytelling.Root>

			<Scrollytelling.Root>
				<Scrollytelling.Pin
					childHeight={100}
					pinSpacerHeight={'150vh'}
					top={0}
				>
					<section className="h-screen w-screen overflow-hidden bg-orange-600">
						<div className="wrapper">
							<h1>Layered pinning 4</h1>
						</div>
					</section>
				</Scrollytelling.Pin>
			</Scrollytelling.Root>
		</>
	);
};
