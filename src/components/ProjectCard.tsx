import type { Project } from "@/types";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { getFrenchTagForProjectId } from "@/lib/utils";

export function ProjectCard({ project }: { project: Project }) {
	const fileHref = `file:///Z:/xxx/${encodeURIComponent(project.code)}`;
	return (
		<div className="rounded-lg border shadow-sm hover:ring-4 hover:ring-ring">
			<div className="border-b p-3 flex items-center justify-between">
				<div>
					<h3 className="text-base font-medium">{project.code} - {project.title}</h3>
					<div className="mt-1 flex items-center gap-2">
						{project.material ? (
							<p className="text-xs text-muted-foreground">{project.material}</p>
						) : null}
						<Badge variant="secondary">{getFrenchTagForProjectId(project.id)}</Badge>
					</div>
				</div>
				<div className="flex items-center gap-2">
					<a href={fileHref} target="_blank" rel="noreferrer" className="inline-flex items-center rounded-md border px-3 py-1.5 text-sm hover:bg-accent">
						Folder
					</a>
					<Link to={`/projects/${project.id}`} className="inline-flex items-center rounded-md border px-3 py-1.5 text-sm hover:bg-accent">
						Open
					</Link>
				</div>
			</div>
			<div className="aspect-video w-full">
				<iframe
					title={`Speckle ${project.code} - ${project.title}`}
					src={project.embedUrl}
					className="h-full w-full"
					frameBorder={0}
					allow="fullscreen"
				/>
			</div>
		</div>
	);
}


