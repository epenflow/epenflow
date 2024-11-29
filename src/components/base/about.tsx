"use client";
import { Terminal } from "@/components/base/terminal";
import ProfileContent from "@/contents/profile.content.mdx";
import { useNavbar } from "@/hooks/use-navbar";
import React from "react";

function H3({ children }: React.PropsWithChildren) {
	return <h3 className="my-2 text-xl font-bold">{children}</h3>;
}
function Ul({ children }: React.PropsWithChildren) {
	return <ul className="list-inside list-disc px-6">{children}</ul>;
}
function Li({ children }: React.PropsWithChildren) {
	return <li>{children}</li>;
}
function Ol({ children }: React.PropsWithChildren) {
	return <ol className="list-inside list-decimal px-6">{children}</ol>;
}
function P({ children }: React.PropsWithChildren) {
	return <p className="my-1 px-2 text-primary/95">{children}</p>;
}
function A({ children }: React.PropsWithChildren) {
	return <a className="text-blue-500">{children}</a>;
}
export const Profile = () => {
	const { isProfile } = useNavbar();
	if (isProfile) {
		return (
			<Terminal className="p-1" header="Profile">
				<ProfileContent
					components={{
						h3: H3,
						ul: Ul,
						li: Li,
						ol: Ol,
						p: P,
					}}
				/>
			</Terminal>
		);
	}
	return null;
};
