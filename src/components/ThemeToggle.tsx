import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

function getInitialTheme(): "light" | "dark" {
	if (typeof localStorage !== "undefined" && localStorage.getItem("theme")) {
		return (localStorage.getItem("theme") as "light" | "dark") ?? "light";
	}
	if (typeof window !== "undefined" && window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) {
		return "dark";
	}
	return "light";
}

export function ThemeToggle() {
	const [theme, setTheme] = useState<"light" | "dark">(getInitialTheme());

	useEffect(() => {
		const root = document.documentElement;
		if (theme === "dark") root.classList.add("dark");
		else root.classList.remove("dark");
		localStorage.setItem("theme", theme);
	}, [theme]);

	return (
		<button
			type="button"
			onClick={() => setTheme((t) => (t === "dark" ? "light" : "dark"))}
			className="inline-flex items-center gap-2 rounded-md border px-3 py-2 text-sm"
			aria-label="Toggle theme"
		>
			{theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
			<span className="hidden sm:inline">{theme === "dark" ? "Light" : "Dark"} mode</span>
		</button>
	);
}
