"use client";
import {
	WindowHOC,
	BaseWindowProps,
} from "@/components/base/window/window.hoc";
import React from "react";

export const BaseWindow: React.FC<BaseWindowProps> = ({ containerRef }) => {
	return <canvas ref={containerRef} width={`100%`} height={`100%`} />;
};

export const Window = WindowHOC(BaseWindow);
