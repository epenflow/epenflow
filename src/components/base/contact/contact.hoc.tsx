"use client";
import React from "react";
import { Terminal } from "@/components/base/terminal";
import { useContact } from "@/components/base/contact/contact.hooks";

export function ContactHOC<T extends object>(
	BaseComponent: React.ComponentType<T>,
) {
	BaseComponent.displayName = "Contact";

	const Contact = (props: T) => {
		const { isContact } = useContact();

		if (!isContact) {
			return null;
		}

		return (
			<Terminal
				label="Let's Talk"
				classNameLabel="text-xs font-extrabold"
				classNameContent="overflow-y-hidden box-border">
				<BaseComponent {...props} />
			</Terminal>
		);
	};

	return Contact;
}
