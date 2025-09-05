import { useMemo, useState } from "react";
import type { Project } from "@/types";
import projectsData from "@/data/projects.json";
import { ProjectList } from "@/components/ProjectList";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SearchBar } from "@/components/SearchBar";
import { getFrenchTagForProjectId, type FrenchTag } from "@/lib/utils";

type Material = "All" | "Wood" | "Concrete" | "Steel";
type TagFilter = "All" | FrenchTag;

export default function Projects() {
	const [material, setMaterial] = useState<Material>("All");
	const [tag, setTag] = useState<TagFilter>("All");
	const [query, setQuery] = useState<string>("");
	const projects = projectsData as Project[];

	const filtered = useMemo(() => {
		let base = material === "All" ? projects : projects.filter((p) => p.material === material);
		if (tag !== "All") {
			base = base.filter((p) => getFrenchTagForProjectId(p.id) === tag);
		}
		const q = query.trim().toLowerCase();
		if (!q) return base;
		return base.filter((p) => p.code.toLowerCase().includes(q) || p.title.toLowerCase().includes(q));
	}, [material, projects, query, tag]);

	// Sort projects by numeric project number ascending (e.g., "141168-00")
	const sorted = useMemo(() => {
		const parseCode = (code: string) => {
			const [primaryStr, suffixStr] = code.split("-");
			const primary = Number(primaryStr.replace(/\D+/g, "")) || 0;
			const suffix = Number((suffixStr ?? "").replace(/\D+/g, "")) || 0;
			return { primary, suffix };
		};
		return [...filtered].sort((a, b) => {
			const ca = parseCode(a.code);
			const cb = parseCode(b.code);
			if (ca.primary !== cb.primary) return ca.primary - cb.primary;
			if (ca.suffix !== cb.suffix) return ca.suffix - cb.suffix;
			return a.id.localeCompare(b.id);
		});
	}, [filtered]);

	return (
		<div className="mx-auto max-w-6xl px-4 py-6">
			<div className="mb-4 flex items-center justify-between">
				<h1 className="text-xl font-semibold">Projects</h1>
				<div className="flex gap-3">
					<div className="w-40">
						<Select value={material} onValueChange={(v) => setMaterial(v as Material)}>
							<SelectTrigger>
								<SelectValue placeholder="Material" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="All">All</SelectItem>
								<SelectItem value="Wood">Wood</SelectItem>
								<SelectItem value="Concrete">Concrete</SelectItem>
								<SelectItem value="Steel">Steel</SelectItem>
							</SelectContent>
						</Select>
					</div>
					<div className="w-40">
						<Select value={tag} onValueChange={(v) => setTag(v as TagFilter)}>
							<SelectTrigger>
								<SelectValue placeholder="Tag" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="All">All</SelectItem>
								<SelectItem value="Bois">Bois</SelectItem>
								<SelectItem value="Acier">Acier</SelectItem>
								<SelectItem value="Béton">Béton</SelectItem>
							</SelectContent>
						</Select>
					</div>
				</div>
			</div>
			<div className="mb-4">
				<SearchBar value={query} onChange={setQuery} placeholder="Search by code or title..." />
			</div>
			<ProjectList projects={sorted} />
		</div>
	);
}


