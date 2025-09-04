import { ScriptCard } from "@/components/ScriptCard";
import type { Script } from "@/types";

export function ScriptList({ scripts }: { scripts: Script[] }) {
	if (scripts.length === 0) {
		return <p className="text-sm text-muted-foreground">No scripts found.</p>;
	}
	return (
		<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
			{scripts.map((s) => (
				<ScriptCard key={s.id} script={s} />
			))}
		</div>
	);
}
