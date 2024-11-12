export const Wallpaper = () => {
	return (
		<section
			className="fixed left-0 top-0 -z-10 h-screen w-full bg-cover bg-no-repeat"
			style={{
				backgroundImage: `url(./wallpaper.webp)`,
			}}
		/>
	);
};
