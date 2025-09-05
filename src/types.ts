export type Script = {
	id: string;
	name: string;
	description: string;
	category: string;
	tags: string[];
	logo?: string;
	icon?: string;
	steps?: string[];
	videoUrl?: string;
};

export type Project = {
	id: string; // unique id for routing
	code: string; // project number (e.g., "141168-00")
	title: string; // human-friendly title (e.g., "plateau 1")
	material?: "Wood" | "Concrete" | "Steel"; // optional
	embedUrl: string; // Speckle embed URL
};