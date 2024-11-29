import Link from "next/link";

export default function NotFound() {
	return (
		<main className="container flex h-screen flex-col justify-center">
			<p className="font-medium">/404 PAGE NOT FOUND</p>
			<p className="font-medium">
				<span>
					Sorry, but the page you were looking for could not be found
				</span>
				<br />
				<span>You can </span>
				<span>
					<Link className="underline" href={"/"}>
						return to our front page,
					</Link>
				</span>
				<span> or </span>
				<span>
					<Link
						className="underline"
						href={"https://mailto:epenflow@gmail.com"}>
						drop us a line
					</Link>
				</span>
				<span> if you can't find what you're looking for.</span>
			</p>
		</main>
	);
}
