import React from "react";
import { Terminal } from "@/components/base/terminal";

export const ContactForm = () => {
	const CSSVariables = {
		"--muted-primary": "#dddddd",
		"--muted-secondary": "#eeeeee",
		"--border-shadow": "1px 1px #fff,-1px -1px #bbb",
		"--border": "1px solid black",
		"--radius": "5px",
	} as React.CSSProperties;

	return (
		<Terminal label="Let's Talk">
			<form
				{...{ style: CSSVariables }}
				className="flex h-full w-full flex-col font-mono">
				<div className="relative flex h-24 w-full items-end bg-[var(--muted-secondary)] text-xs font-bold">
					<div className="container flex gap-1.5">
						<div className="rounded-t-md bg-[var(--muted-primary)] px-2.5 pt-1">
							<h1>MESSAGE</h1>
						</div>
						<div className="rounded-t-md bg-[var(--muted-primary)] px-2.5 pt-1">
							<h1>CALENDER</h1>
						</div>
					</div>
				</div>
				<div className="h-full w-full bg-[var(--muted-primary)]"></div>
				<div className="flex h-full w-full items-center justify-center bg-[var(--muted-secondary)]">
					<div className="container h-4/5">
						<textarea
							className="h-full w-full rounded-[var(--radius)] [border:var(--border)] [box-shadow:var(--border-shadow)] placeholder:p-2.5 placeholder:text-xs placeholder:font-bold placeholder:text-primary"
							placeholder="Your Message..."
						/>
					</div>
				</div>
			</form>
		</Terminal>
	);
};
