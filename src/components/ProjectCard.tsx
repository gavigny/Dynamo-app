import type { Project } from "@/types";
import { Link } from "react-router-dom";

export function ProjectCard({ project }: { project: Project }) {
	return (
		<div className="rounded-lg border">
			<div className="border-b p-3">
				<h3 className="text-base font-medium">{project.id}</h3>
				<p className="text-xs text-muted-foreground">{project.material}</p>
			</div>
			<div className="aspect-video w-full">
				<iframe
					title={`Speckle ${project.id}`}
					src={project.embedUrl}
					className="h-full w-full"
					frameBorder={0}
					allow="fullscreen"
				/>
			</div>
			<div className="flex items-center justify-end gap-2 border-t p-3">
				<Link to={`/projects/${project.id}`} className="inline-flex items-center rounded-md border px-3 py-1.5 text-sm hover:bg-accent">
					Open
				</Link>
			</div>
		</div>
	);
}


