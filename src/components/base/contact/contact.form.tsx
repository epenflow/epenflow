"use client";
import React from "react";
import "./contact.css";
import { ContactHOC } from "@/components/base/contact/contact.hoc";

export const BaseContactForm = () => {
	return (
		<form className="form-container">
			<div className="tab-container">
				<div className="tab-items-container">
					<div className="tab-item">
						<h1>MESSAGE</h1>
					</div>
					<div className="tab-item">
						<h1>CALENDER</h1>
					</div>
				</div>
			</div>
			<div className="input-container">
				<div className="input-content">
					<div className="input-item-content">
						<label htmlFor="name">From</label>
						<input type="text" className="input-item" />
					</div>
					<div className="input-item-content">
						<label htmlFor="name">Email</label>
						<input type="text" className="input-item" />
					</div>
					<div className="input-item-content">
						<label htmlFor="name">Subject</label>
						<input type="text" className="input-item" />
					</div>
				</div>
			</div>
			<div className="message-container">
				<div className="message-content">
					<textarea
						className="message-textarea"
						placeholder="Your Message..."
					/>
					<button className="message-button">SEND MESSAGE</button>
				</div>
			</div>
		</form>
	);
};
export const Contact = ContactHOC(BaseContactForm);
