'use client';
import { Window } from '@/app/__components__/window';
import { Button } from '@/components/ui/button';
import React from 'react';

export const CameraApp = () => {
	const videoContainer = React.useRef<React.ElementRef<'video'>>(null);
	const [isActive, setActive] = React.useState<boolean>(false);
	function handleClick() {
		const mediaDevices = navigator.mediaDevices;
		if (
			isActive &&
			videoContainer.current &&
			videoContainer.current.srcObject
		) {
			const stream = videoContainer.current.srcObject as MediaStream;
			const tracks = stream.getTracks();
			tracks.forEach((track) => {
				track.stop();
			});
			videoContainer.current.srcObject = null;
			setActive((prev) => !prev);
			return;
		}
		mediaDevices
			.getUserMedia({
				video: true,
				audio: true,
			})
			.then((stream) => {
				if (videoContainer.current) {
					videoContainer.current.srcObject = stream;
					videoContainer.current.addEventListener(
						'loadedmetadata',
						() => {
							videoContainer.current?.play();
						},
					);
				}
			})
			.catch((error) => {
				console.error(error);
			});
		setActive((prev) => !prev);
	}
	return (
		<Window label="Camera--APP">
			<div className="relative flex h-full w-full items-center justify-center bg-[#00ff0d] p-5">
				<video
					ref={videoContainer}
					className="h-full w-full bg-black window-border"
				></video>
				{!isActive && (
					<h1 className="absolute font-mono text-4xl text-white">
						Camera/Off
					</h1>
				)}
				<Button
					onClick={handleClick}
					variant={'window'}
					className="absolute bottom-2.5 left-1/2 z-10 -translate-x-1/2"
				>
					{isActive ? 'Turn/Off--camera' : 'Turn/On--camera'}
				</Button>
			</div>
		</Window>
	);
};
