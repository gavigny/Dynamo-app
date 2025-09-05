import { useMemo, useState } from "react";
import type { Project } from "@/types";
import projectsData from "@/data/projects.json";
import { ProjectList } from "@/components/ProjectList";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type Material = "All" | "Wood" | "Concrete" | "Steel";

export default function Projects() {
	const [material, setMaterial] = useState<Material>("All");
	const projects = projectsData as Project[];

	const filtered = useMemo(() => {
		if (material === "All") return projects;
		return projects.filter((p) => p.material === material);
	}, [material, projects]);

	return (
		<div className="mx-auto max-w-6xl px-4 py-6">
			<div className="mb-4 flex items-center justify-between">
				<h1 className="text-xl font-semibold">Projects</h1>
				<div className="w-48">
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
			</div>
			<ProjectList projects={filtered} />
		</div>
	);
}


