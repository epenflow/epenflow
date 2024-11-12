"use client";
import "./style.css";
import React from "react";
import { ONE_SECOND_IN_MS, TIME_FH_MM_SS_12H } from "@/constants";
import { useTime } from "@/hooks";

export const MacNavbar = () => {
	const time = useTime(ONE_SECOND_IN_MS, TIME_FH_MM_SS_12H);

	function triggerMenu() {
		console.log("trigger menu");
	}
	return (
		<header className="mac-navbar">
			<section className="container flex items-center justify-between text-xs font-bold">
				<div className="flex flex-1 items-center justify-start gap-2">
					<button onClick={triggerMenu}>File</button>
					<button>Contact</button>
				</div>
				<div className="flex flex-1 items-center justify-end">
					<h1 suppressHydrationWarning>{time}</h1>
				</div>
			</section>
		</header>
	);
};
