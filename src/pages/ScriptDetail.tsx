import { useMemo, useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import data from "@/data/scripts.json";
import type { Script } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

function removeAccents(input: string): string {
	return input.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}
function slugify(input: string): string {
	return removeAccents(input)
		.toLowerCase()
		.replace(/[^a-z0-9\s-]/g, "")
		.replace(/\s+/g, "-")
		.replace(/-+/g, "-");
}
function buildIconCandidates(name: string, preferred?: string[]): string[] {
	const raw = name.trim();
	const rawCollapsed = raw.replace(/\s+/g, " ");
	const noAccents = removeAccents(rawCollapsed);
	const hyphen = slugify(rawCollapsed);
	const underscore = noAccents.replace(/\s+/g, "_");
	const lower = rawCollapsed.toLowerCase();

	const bases = Array.from(new Set([`/icons/${rawCollapsed}`, `/icons/${noAccents}`, `/icons/${hyphen}`, `/icons/${underscore}`, `/icons/${lower}`]));
	const exts = [".png", ".PNG", ".jpg", ".JPG", ".jpeg", ".JPEG", ".svg", ".SVG", ".webp", ".WEBP"];
	const fromBases = bases.flatMap((b) => exts.map((e) => b + e));
	return [...(preferred ?? []), ...fromBases, "/icons/placeholder.jpg"];
}

const DEFAULT_VIDEO_URL = "/videos/add-revision-to-sheets.png.mp4"; // global fallback for all scripts

const STORAGE_KEY = "app-scripts";

export default function ScriptDetail() {
	const { id } = useParams();
	const navigate = useNavigate();
	let scripts: Script[] = data as Script[];
	try {
		const saved = localStorage.getItem(STORAGE_KEY);
		scripts = saved ? (JSON.parse(saved) as Script[]) : (data as Script[]);
	} catch {
		// ignore storage errors and use bundled data
	}
	const script = useMemo(() => scripts.find((s) => s.id === id), [scripts, id]);

	if (!script) {
		return (
			<div className="mx-auto max-w-4xl px-4 py-8">
				<p className="text-sm text-muted-foreground">Script not found.</p>
				<Link to="/" className="mt-4 inline-block text-sm underline">
					Back to list
				</Link>
			</div>
		);
	}

	const candidates = useMemo(() => buildIconCandidates(script.name, [script.logo ?? "", script.icon ?? ""].filter(Boolean)), [script.name, script.logo, script.icon]);
	const [idx, setIdx] = useState(0);
	useEffect(() => setIdx(0), [candidates.join("|")]);

	const videoUrl = script.videoUrl ?? DEFAULT_VIDEO_URL;
	const isFileVideo = useMemo(() => {
		const v = videoUrl ?? "";
		return /\.(mp4|webm|ogg)$/i.test(v) || v.startsWith("/videos/");
	}, [videoUrl]);

	return (
		<div className="mx-auto max-w-4xl px-4 py-8">
			<div className="flex items-center justify-between">
				<Link to="/" className="text-sm underline">← Back</Link>
				<button
					onClick={() => {
						if (!script) return;
						const ok = window.confirm("Are you sure you want to remove this script?");
						if (!ok) return;
						try {
							const saved = localStorage.getItem(STORAGE_KEY);
							const current = saved ? (JSON.parse(saved) as Script[]) : (data as Script[]);
							const next = current.filter((s) => s.id !== script.id);
							localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
						} catch {
							// ignore
						}
						navigate("/", { replace: true });
					}}
					className="rounded-md border px-3 py-1.5 text-sm text-red-600 hover:bg-red-50"
				>
					Remove Script
				</button>
			</div>
			<Card className="mt-4">
				<CardHeader className="flex-row items-center gap-4">
					<img
						src={candidates[idx]}
						alt="logo"
						className="h-14 w-14 rounded object-cover bg-muted"
						onError={() => setIdx((v) => (v < candidates.length - 1 ? v + 1 : v))}
					/>
					<div>
						<CardTitle>{script.name}</CardTitle>
						<CardDescription>{script.description}</CardDescription>
					</div>
				</CardHeader>
				<CardContent>
					<div className="mb-4 flex flex-wrap gap-2">
						<Badge variant="secondary">{script.category}</Badge>
						{script.tags.map((t) => (
							<Badge key={t} variant="outline">{t}</Badge>
						))}
					</div>

					{script.steps?.length ? (
						<div className="space-y-2">
							<h3 className="text-base font-medium">Steps</h3>
							<ol className="list-decimal space-y-1 pl-6">
								{script.steps.map((step, idx) => (
									<li key={idx}>{step}</li>
								))}
							</ol>
						</div>
					) : null}

					{videoUrl ? (
						<div className="mt-6 space-y-2">
							<h3 className="text-base font-medium">Demonstration</h3>
							<div className="aspect-video w-full overflow-hidden rounded border">
								{isFileVideo ? (
									<video src={videoUrl} controls preload="metadata" poster={candidates[0]} className="h-full w-full" />
								) : (
									<iframe
										src={videoUrl}
										title="Demonstration video"
										allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
										allowFullScreen
										className="h-full w-full"
									/>
								)}
							</div>
						</div>
					) : null}
				</CardContent>
			</Card>
		</div>
	);
}
