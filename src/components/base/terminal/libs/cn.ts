import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...args: Array<ClassValue>) {
	return twMerge(clsx(args));
}
