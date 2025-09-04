import { Input } from "@/components/ui/input";
import type React from "react";

export function SearchBar({ value, onChange }: { value: string; onChange: (v: string) => void }) {
	return (
		<div className="w-full max-w-xl">
			<Input
				placeholder="Search scripts..."
				value={value}
				onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange(e.target.value)}
			/>
		</div>
	);
}
