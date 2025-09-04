import { useMemo } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

export type Filters = {
	category: string | null;
	tag: string | null;
};

export function FilterControls({
	scripts,
	filters,
	onChange,
}: {
	scripts: { category: string; tags: string[] }[];
	filters: Filters;
	onChange: (f: Filters) => void;
}) {
	const categories = useMemo(() => Array.from(new Set(scripts.map((s) => s.category))).sort(), [scripts]);
	const tags = useMemo(
		() => Array.from(new Set(scripts.flatMap((s) => s.tags))).sort(),
		[scripts]
	);

	return (
		<div className="flex w-full flex-col gap-3 sm:flex-row sm:items-center">
			<div className="w-60">
				<Label className="mb-1 block">Category</Label>
				<Select
					value={filters.category ?? "all"}
					onValueChange={(v: string) => onChange({ ...filters, category: v === "all" ? null : v })}
				>
					<SelectTrigger>
						<SelectValue placeholder="All" />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="all">All</SelectItem>
						{categories.map((c) => (
							<SelectItem key={c} value={c}>
								{c}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
			</div>

			<div className="w-60">
				<Label className="mb-1 block">Tag</Label>
				<Select
					value={filters.tag ?? "all"}
					onValueChange={(v: string) => onChange({ ...filters, tag: v === "all" ? null : v })}
				>
					<SelectTrigger>
						<SelectValue placeholder="All" />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="all">All</SelectItem>
						{tags.map((t) => (
							<SelectItem key={t} value={t}>
								{t}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
			</div>
		</div>
	);
}
