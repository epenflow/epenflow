"use client";
import "./style.css";
import React from "react";
import { ONE_SECOND_IN_MS, TIME_FH_MM_SS_12H } from "@/constants";
import { useTime } from "@/hooks";
import { useNavbar } from "@/hooks/use-navbar";

export const Navbar = () => {
	const time = useTime(ONE_SECOND_IN_MS, TIME_FH_MM_SS_12H);
	const { setProfile, setNote } = useNavbar();

	return (
		<header className="navbar">
			<section className="container flex items-center justify-between text-xs font-bold">
				<div className="flex flex-1 items-center justify-start gap-2">
					<button>File</button>
					<button onClick={setProfile}>Profile</button>
					<button onClick={setNote}>Note</button>
				</div>
				<div className="flex flex-1 items-center justify-end">
					<h1 suppressHydrationWarning>{time}</h1>
				</div>
			</section>
		</header>
	);
};
