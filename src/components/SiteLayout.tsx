import { Outlet } from "react-router-dom";
import { ThemeToggle } from "@/components/ThemeToggle";
import { NavTabs } from "@/components/NavTabs";

export function SiteLayout() {
	return (
		<div className="min-h-screen bg-background">
			<header className="sticky top-0 z-10 border-b bg-background/80 backdrop-blur">
				<div className="relative mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
					<div className="flex items-center gap-3">
						<img src="/logos/gbi.png" onError={(e) => { (e.currentTarget as HTMLImageElement).src = "/vite.svg"; }} alt="GBI" className="h-8 w-auto" />
					</div>
					<div className="pointer-events-none absolute inset-0 hidden items-center justify-center sm:flex">
						<span className="text-sm font-medium sm:text-base">BIM Copilot</span>
					</div>
					<div className="flex items-center gap-2">
						<ThemeToggle />
					</div>
				</div>
				<div className="border-t bg-background">
					<NavTabs />
				</div>
			</header>
			<Outlet />
		</div>
	);
}


