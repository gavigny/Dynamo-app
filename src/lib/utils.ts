import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export type FrenchTag = "Bois" | "Acier" | "Béton";

// Deterministically assign a French material tag based on a string id
export function getFrenchTagForProjectId(id: string): FrenchTag {
	let hash = 0;
	for (let i = 0; i < id.length; i++) {
		// simple string hash
		hash = (hash << 5) - hash + id.charCodeAt(i);
		hash |= 0; // convert to 32-bit int
	}
	const idx = Math.abs(hash) % 3;
	return idx === 0 ? "Bois" : idx === 1 ? "Acier" : "Béton";
}