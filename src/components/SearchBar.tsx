import { Input } from "@/components/ui/input";
import type React from "react";

export function SearchBar({ value, onChange, placeholder }: { value: string; onChange: (v: string) => void; placeholder?: string }) {
	return (
		<div className="w-full max-w-xl">
			<Input
				placeholder={placeholder ?? "Search scripts..."}
				value={value}
				onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange(e.target.value)}
			/>
		</div>
	);
}
