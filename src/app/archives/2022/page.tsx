import "./style.css";
import {
	CONTACT,
	DESCRIPTIONS,
	EDUCATION,
	FEATURED,
} from "@/app/archives/2022/constant";

import List from "@/utils/list";
import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";

function Page() {
	return (
		<>
			<header className="overflow-x-clip sticky top-0 z-50">
				<nav className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 md:p-4 bg-[var(--lush-white)]">
					<ul className="flex items-center justify-between md:justify-normal">
						<li className="header-heading">EF-STUDIO</li>
						<li>
							<Image
								src={"/Cakra.png"}
								width={50}
								height={50}
								alt="cakra"
								className="header-cakra"
							/>
						</li>
					</ul>
					<ul className="header-menu ">
						<li className="header-menu-item">
							<h1>HOME</h1>
						</li>
						<li className="header-menu-item">
							<h1>PROJECT</h1>
						</li>
					</ul>
				</nav>
			</header>
			<main className="grid md:grid-cols-2 lg:grid-cols-2 grid-cols-1">
				<section className="bg-[var(--lush-blue)] h-svh px-[5px] text-[var(--lush-white)] flex items-center justify-center text-justify flex-wrap relative overflow-x-clip">
					<Image
						src={"/Cakra.png"}
						width={420}
						height={420}
						alt="cakra"
						className="header-cakra absolute"
					/>
					<div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 w-[calc(100%-5px)]">
						<h1 className="my-10 text-center text-4xl font-bold">
							ABOUT
						</h1>
						<p>{DESCRIPTIONS}</p>
					</div>
				</section>
				<section className="px-[5px]">
					<ul className="resume-border">
						<li className="resume-heading">{EDUCATION.LABEL}</li>
						<List list={EDUCATION.LIST}>
							{(item) => (
								<li key={item} className="resume-item">
									{item}
								</li>
							)}
						</List>
					</ul>
					<ul className="resume-border">
						<li className="resume-heading">{CONTACT.LABEL}</li>
						<List list={CONTACT.LIST}>
							{({ HREF, LABEL }) => (
								<li key={LABEL} className="resume-item">
									<Link href={HREF}>{LABEL}</Link>
								</li>
							)}
						</List>
					</ul>
					<ul>
						<li className="resume-heading">{FEATURED.LABEL}</li>
						<li className="resume-item">{FEATURED.DESCRIPTIONS}</li>
					</ul>
				</section>
			</main>
		</>
	);
}
export default dynamic(() => Promise.resolve(Page));
