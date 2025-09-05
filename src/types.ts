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
	id: string; // project number or slug
	material: "Wood" | "Concrete" | "Steel";
	embedUrl: string; // Speckle embed URL
};