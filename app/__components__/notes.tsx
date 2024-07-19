import { __notes } from '@/app/__components__/__constants__';
import { Terminal } from '@/app/__components__/terminal';

export const Notes = () => {
	return (
		<Terminal
			label={__notes.header}
			position={{ x: 150, y: 50 }}
			className="space-y-5"
		>
			<p className="px-4 text-justify text-5xl lg:text-7xl">
				{__notes.descriptions}
			</p>
			{/* <p className="text-2xl">
				THANK`s
				<Link
					href="https://public---domain.com/"
					className="text-blue-800 transition-all hover:underline"
				>
					&nbsp;https://public---domain.com/ &nbsp;
				</Link>
				for inspiring me to build an interactive terminal
			</p> */}
			<video
				autoPlay
				muted
				loop
				className="flex h-full w-full items-center justify-center"
			>
				<source
					src="/bangliskatepark.mp4"
					className="h-full w-full"
				></source>
			</video>
		</Terminal>
	);
};
