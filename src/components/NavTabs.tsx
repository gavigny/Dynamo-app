import { NavLink } from "react-router-dom";

export function NavTabs() {
	const base = "inline-flex items-center px-3 py-2 text-sm border-b-2";
	const off = "border-transparent text-muted-foreground hover:text-foreground";
	const on = "border-foreground text-foreground";

	return (
		<nav className="mx-auto flex max-w-6xl items-center gap-4 px-4">
			<NavLink to="/" end className={({ isActive }) => `${base} ${isActive ? on : off}`}>
				Dynamo
			</NavLink>
			<NavLink to="/gabarit" className={({ isActive }) => `${base} ${isActive ? on : off}`}>
				Gabarit
			</NavLink>
			<NavLink to="/projects" className={({ isActive }) => `${base} ${isActive ? on : off}`}>
				Projects
			</NavLink>
		</nav>
	);
}


