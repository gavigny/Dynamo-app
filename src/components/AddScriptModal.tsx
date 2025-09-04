import { useEffect, useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { Script } from "@/types";

function slugify(input: string): string {
	return input
		.toLowerCase()
		.trim()
		.replace(/[^a-z0-9\s-]/g, "")
		.replace(/\s+/g, "-")
		.replace(/-+/g, "-");
}

export function AddScriptModal({
	open,
	onClose,
	onAdd,
	existingScripts,
}: {
	open: boolean;
	onClose: () => void;
	onAdd: (script: Script) => void;
	existingScripts: Script[];
}) {
	const [name, setName] = useState("");
	const [description, setDescription] = useState("");
	const [category, setCategory] = useState("");
	const [tagsText, setTagsText] = useState("");
	const [logoUrl, setLogoUrl] = useState("");
	const [videoUrl, setVideoUrl] = useState("");
	const [stepsText, setStepsText] = useState("");

	useEffect(() => {
		if (!open) {
			setName("");
			setDescription("");
			setCategory("");
			setTagsText("");
			setLogoUrl("");
			setVideoUrl("");
			setStepsText("");
		}
	}, [open]);

	const canSubmit = useMemo(() => name.trim() && description.trim() && category.trim(), [name, description, category]);

	function handleSubmit(e: React.FormEvent) {
		e.preventDefault();
		if (!canSubmit) return;
		const baseId = slugify(name);
		let uniqueId = baseId || `script-${existingScripts.length + 1}`;
		let i = 2;
		const existingIds = new Set(existingScripts.map((s) => s.id));
		while (existingIds.has(uniqueId)) {
			uniqueId = `${baseId}-${i++}`;
		}

		const tags = tagsText
			.split(",")
			.map((t) => t.trim())
			.filter(Boolean);

		const steps = stepsText
			.split(/\r?\n/)
			.map((s) => s.trim())
			.filter(Boolean);

		const newScript: Script = {
			id: uniqueId,
			name: name.trim(),
			description: description.trim(),
			category: category.trim(),
			tags,
			logo: logoUrl.trim() || undefined,
			videoUrl: videoUrl.trim() || undefined,
			steps: steps.length ? steps : undefined,
		};
		onAdd(newScript);
		onClose();
	}

	if (!open) return null;

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center">
			<div className="absolute inset-0 bg-black/50" onClick={onClose} />
			<div className="relative z-10 w-full max-w-lg rounded-lg border bg-card p-4 shadow">
				<h2 className="mb-3 text-lg font-semibold">Add new script</h2>
				<form onSubmit={handleSubmit} className="space-y-3">
					<div>
						<Label className="mb-1 block">Name</Label>
						<Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Script name" />
					</div>
					<div>
						<Label className="mb-1 block">Description</Label>
						<textarea
							value={description}
							onChange={(e) => setDescription(e.target.value)}
							className="flex min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
							placeholder="Short summary"
						/>
					</div>
					<div>
						<Label className="mb-1 block">Category</Label>
						<Input value={category} onChange={(e) => setCategory(e.target.value)} placeholder="e.g. Documentation" />
					</div>
					<div>
						<Label className="mb-1 block">Tags (comma-separated)</Label>
						<Input value={tagsText} onChange={(e) => setTagsText(e.target.value)} placeholder="e.g. Sheets, Revisions" />
					</div>
					<div>
						<Label className="mb-1 block">Logo URL (JPEG/PNG)</Label>
						<Input value={logoUrl} onChange={(e) => setLogoUrl(e.target.value)} placeholder="https://.../image.jpg or /icons/my.jpg" />
					</div>
					<div>
						<Label className="mb-1 block">Video URL (optional)</Label>
						<Input value={videoUrl} onChange={(e) => setVideoUrl(e.target.value)} placeholder="https://www.youtube.com/embed/..." />
					</div>
					<div>
						<Label className="mb-1 block">Steps (one per line)</Label>
						<textarea
							value={stepsText}
							onChange={(e) => setStepsText(e.target.value)}
							className="flex min-h-[100px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
							placeholder={`Step 1...\nStep 2...`}
						/>
					</div>
					<div className="flex justify-end gap-2 pt-2">
						<button type="button" onClick={onClose} className="rounded-md border px-3 py-2 text-sm">
							Cancel
						</button>
						<button disabled={!canSubmit} className="rounded-md border bg-primary px-3 py-2 text-sm text-primary-foreground disabled:opacity-50">
							Add script
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}
