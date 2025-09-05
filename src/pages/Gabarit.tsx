import updatesData from "@/data/templateUpdates.json";
import { useMemo, useState } from "react";

type UpdateItem = { date: string; text: string };

function formatMonth(year: number, monthIndex: number): { weeks: (Date | null)[][]; label: string } {
	const first = new Date(year, monthIndex, 1);
	const label = first.toLocaleDateString(undefined, { month: "long", year: "numeric" });
	const startDay = (first.getDay() + 6) % 7; // Monday=0
	const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
	const pad: (Date | null)[] = Array.from({ length: startDay }, () => null as null);
	const days: (Date | null)[] = Array.from({ length: daysInMonth }, (_, i) => new Date(year, monthIndex, i + 1) as Date);
	const cells: (Date | null)[] = pad.concat(days);
	while (cells.length % 7 !== 0) cells.push(null);
	const weeks: (Date | null)[][] = [];
	for (let i = 0; i < cells.length; i += 7) weeks.push(cells.slice(i, i + 7));
	return { weeks, label };
}

export default function Gabarit() {
	const updates = updatesData as UpdateItem[];
	const datesWithUpdates = useMemo(() => new Set(updates.map((u) => u.date)), [updates]);
	const latest = useMemo(() => updates.map((u) => u.date).sort().at(-1) ?? new Date().toISOString().slice(0, 10), [updates]);
	const [cursor, setCursor] = useState<Date>(new Date(latest));
	const [selectedDate, setSelectedDate] = useState<string>(latest);

	const { weeks, label } = useMemo(() => formatMonth(cursor.getFullYear(), cursor.getMonth()), [cursor]);
	const selectedUpdates = useMemo(() => updates.filter((u) => u.date === selectedDate), [updates, selectedDate]);

	function gotoMonth(offset: number) {
		const d = new Date(cursor);
		d.setMonth(d.getMonth() + offset);
		setCursor(d);
	}

	function isSameDate(d: Date, iso: string) {
		const s = d.toISOString().slice(0, 10);
		return s === iso;
	}

	return (
		<div className="mx-auto max-w-6xl px-4 py-6">
			<h1 className="text-xl font-semibold">Gabarit · Template Updates</h1>
			<div className="mt-4 rounded-lg border shadow-sm">
				<div className="flex items-center justify-between border-b p-3">
					<button onClick={() => gotoMonth(-1)} className="inline-flex items-center rounded-md border px-3 py-1.5 text-sm">Prev</button>
					<div className="text-sm font-medium">{label}</div>
					<button onClick={() => gotoMonth(1)} className="inline-flex items-center rounded-md border px-3 py-1.5 text-sm">Next</button>
				</div>
				<div className="grid grid-cols-7 gap-px bg-border p-px">
					{["Mon","Tue","Wed","Thu","Fri","Sat","Sun"].map((d) => (
						<div key={d} className="bg-background px-2 py-1 text-center text-xs text-muted-foreground">{d}</div>
					))}
				</div>
				<div className="grid grid-cols-7 gap-px bg-border p-px">
					{weeks.map((row, ri) => row.map((cell, ci) => {
						if (!cell) return <div key={`${ri}-${ci}`} className="h-20 bg-muted/30" />;
						const iso = cell.toISOString().slice(0, 10);
						const has = datesWithUpdates.has(iso);
						const isSel = isSameDate(cell, selectedDate);
						return (
							<button
								key={`${ri}-${ci}`}
								onClick={() => setSelectedDate(iso)}
								className={
									`h-20 w-full rounded bg-background p-2 text-left transition-colors ` +
									(isSel ? `ring-2 ring-ring` : has ? `hover:bg-accent` : `opacity-70 hover:opacity-100`)
								}
								title={iso}
							>
								<div className="text-xs font-medium">{cell.getDate()}</div>
								{has ? <div className="mt-1 text-[10px] text-primary">• Update</div> : null}
							</button>
						);
					}))}
				</div>
			</div>
			<div className="mt-6">
				<h2 className="text-sm font-medium">Updates for {selectedDate}</h2>
				{selectedUpdates.length === 0 ? (
					<p className="mt-2 text-sm text-muted-foreground">No updates for this date.</p>
				) : (
					<ul className="mt-2 space-y-3">
						{selectedUpdates.map((u, i) => (
							<li key={i} className="rounded border p-3 text-sm">
								{u.text}
							</li>
						))}
					</ul>
				)}
			</div>
		</div>
	);
}


