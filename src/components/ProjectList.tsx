import type { Project } from "@/types";
import { ProjectCard } from "@/components/ProjectCard";

export function ProjectList({ projects }: { projects: Project[] }) {
	if (projects.length === 0) {
		return <p className="text-sm text-muted-foreground">No projects found.</p>;
	}
	return (
		<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
			{projects.map((p) => (
				<ProjectCard key={p.id} project={p} />
			))}
		</div>
	);
}


