import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import type { Script } from "@/types";
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

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

function buildIconCandidates(name: string, prefixed?: string[], suffixed?: string[]): string[] {
	const raw = name.trim();
	const rawCollapsed = raw.replace(/\s+/g, " ");
	const noAccents = removeAccents(rawCollapsed);
	const hyphen = slugify(rawCollapsed);
	const underscore = noAccents.replace(/\s+/g, "_");
	const lower = rawCollapsed.toLowerCase();

	const bases = Array.from(
		new Set([
			`/icons/${rawCollapsed}`,
			`/icons/${noAccents}`,
			`/icons/${hyphen}`,
			`/icons/${underscore}`,
			`/icons/${lower}`,
		])
	);

	const exts = [".png", ".PNG", ".jpg", ".JPG", ".jpeg", ".JPEG", ".svg", ".SVG", ".webp", ".WEBP"];
	const fromBases = bases.flatMap((b) => exts.map((e) => b + e));
	return [
		...(prefixed ?? []),
		...fromBases,
		...(suffixed ?? []),
		"/icons/placeholder.jpg",
	];
}

export function ScriptCard({ script }: { script: Script }) {
	const candidates = useMemo(() => {
		const preferred: string[] = [];
		if (script.logo) preferred.push(script.logo);
		if (script.icon) preferred.push(script.icon);
		return buildIconCandidates(script.name, preferred);
	}, [script.logo, script.icon, script.name]);

	const [idx, setIdx] = useState(0);
	useEffect(() => setIdx(0), [candidates.join("|")]);

	return (
		<Link to={`/script/${script.id}`} className="block">
			<Card className="shadow-sm hover:ring-4 hover:ring-ring">
				<CardHeader className="flex-row items-center gap-4">
					<img
						src={candidates[idx]}
						alt="logo"
						className="h-12 w-12 rounded object-cover bg-muted"
						onError={() => setIdx((v) => (v < candidates.length - 1 ? v + 1 : v))}
					/>
					<div>
						<CardTitle className="text-lg">{script.name}</CardTitle>
						<CardDescription>{script.description}</CardDescription>
					</div>
				</CardHeader>
				<CardContent className="flex flex-wrap gap-2 pt-0">
					<Badge variant="secondary">{script.category}</Badge>
					{script.tags.map((t) => (
						<Badge key={t} variant="outline">{t}</Badge>
					))}
				</CardContent>
			</Card>
		</Link>
	);
}
