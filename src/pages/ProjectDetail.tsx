import { Link, useParams } from "react-router-dom";
import type { Project } from "@/types";
import data from "@/data/projects.json";

export default function ProjectDetail() {
	const { id } = useParams();
	const projects = data as Project[];
	const project = projects.find((p) => p.id === id);

	if (!project) {
		return (
			<div className="mx-auto max-w-6xl px-4 py-6">
				<p className="text-sm text-muted-foreground">Project not found.</p>
				<Link to="/projects" className="mt-4 inline-block text-sm underline">Back to projects</Link>
			</div>
		);
	}

	return (
		<div className="mx-auto max-w-7xl px-4 py-6">
			<div className="mb-3 flex items-center justify-between">
				<Link to="/projects" className="text-sm underline">← Back to projects</Link>
				<h1 className="text-lg font-semibold">
					{project.code} - {project.title}
					{project.material ? (
						<>
							{' '}· {project.material}
						</>
					) : null}
				</h1>
			</div>
			<div className="aspect-video w-full overflow-hidden rounded border">
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


