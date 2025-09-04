import { useMemo, useState } from "react";
import data from "@/data/scripts.json";
import { SearchBar } from "@/components/SearchBar";
import { FilterControls, type Filters } from "@/components/FilterControls";
import { ScriptList } from "@/components/ScriptList";
import type { Script } from "@/types";
import { ThemeToggle } from "@/components/ThemeToggle";
import { AddScriptModal } from "@/components/AddScriptModal";

export default function App() {
	const [scripts, setScripts] = useState<Script[]>(data as Script[]);
	const [query, setQuery] = useState("");
	const [filters, setFilters] = useState<Filters>({ category: null, tag: null });
	const [isAddOpen, setIsAddOpen] = useState(false);

	const filtered = useMemo(() => {
		return scripts.filter((s: Script) => {
			const q = query.trim().toLowerCase();
			const matchesQuery = q
				? s.name.toLowerCase().includes(q) || s.description.toLowerCase().includes(q) || s.tags.join(" ").toLowerCase().includes(q)
				: true;
			const matchesCategory = filters.category ? s.category === filters.category : true;
			const matchesTag = filters.tag ? s.tags.includes(filters.tag) : true;
			return matchesQuery && matchesCategory && matchesTag;
		});
	}, [scripts, query, filters]);

	return (
		<div className="min-h-screen bg-background">
			<header className="sticky top-0 z-10 border-b bg-background/80 backdrop-blur">
				<div className="relative mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
					<div className="flex items-center gap-3">
						<img src="/logos/gbi.png" onError={(e) => { (e.currentTarget as HTMLImageElement).src = "/vite.svg"; }} alt="GBI" className="h-8 w-auto" />
					</div>
					<div className="pointer-events-none absolute inset-0 flex items-center justify-center">
						<span className="text-sm font-medium sm:text-base">Dyanmo / Orkestra</span>
					</div>
					<div className="flex items-center gap-2">
						<button
							type="button"
							onClick={() => setIsAddOpen(true)}
							className="inline-flex items-center rounded-md border px-3 py-2 text-sm"
						>
							Add Script
						</button>
						<ThemeToggle />
					</div>
				</div>
			</header>
			<main className="mx-auto max-w-6xl px-4 py-6">
				<div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
					<SearchBar value={query} onChange={setQuery} />
					<FilterControls scripts={scripts} filters={filters} onChange={setFilters} />
				</div>
				<div className="mt-6">
					<ScriptList scripts={filtered} />
				</div>
			</main>
			<AddScriptModal
				open={isAddOpen}
				onClose={() => setIsAddOpen(false)}
				existingScripts={scripts}
				onAdd={(script) => setScripts((prev) => [script, ...prev])}
			/>
		</div>
	);
}
