import { useEffect, useMemo, useRef, useState } from "react";
import type { Project } from "@/types";
import { Input } from "@/components/ui/input";
import { BUILT_IN_OPENAI_API_KEY } from "@/config";

type ChatMessage = {
	role: "user" | "assistant";
	content: string;
};

export function ChatPanel({ project, apiUrl }: { project: Project; apiUrl?: string }) {
	const [messages, setMessages] = useState<ChatMessage[]>([{
		role: "assistant",
		content: `Vous consultez le projet ${project.code} - ${project.title}. Posez vos questions spécifiques à ce projet.`,
	}]);
	const [input, setInput] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const [apiKey, setApiKey] = useState<string>("");
	const [loadingDots, setLoadingDots] = useState<string>("");
	const scrollRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const saved = localStorage.getItem("openai_api_key") ?? "";
		if (saved) setApiKey(saved);
		else if (BUILT_IN_OPENAI_API_KEY) setApiKey(BUILT_IN_OPENAI_API_KEY);
	}, []);

	// Keep the latest message in view
	useEffect(() => {
		if (scrollRef.current) {
			scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
		}
	}, [messages.length, isLoading, loadingDots]);

	// Animated typing dots while loading
	useEffect(() => {
		if (!isLoading) {
			setLoadingDots("");
			return;
		}
		let i = 0;
		const id = setInterval(() => {
			const dots = ".".repeat((i % 3) + 1);
			setLoadingDots(dots);
			i += 1;
		}, 450);
		return () => clearInterval(id);
	}, [isLoading]);

	const canSend = useMemo(() => input.trim().length > 0 && !isLoading, [input, isLoading]);

	function appendMessage(msg: ChatMessage) {
		setMessages((prev) => [...prev, msg]);
		queueMicrotask(() => {
			if (scrollRef.current) {
				scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
			}
		});
	}

	async function handleSend() {
		if (!canSend) return;
		const text = input.trim();
		setInput("");
		appendMessage({ role: "user", content: text });
		setIsLoading(true);
		try {
			if (apiUrl) {
				const res = await fetch(apiUrl, {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({ project: { id: project.id, code: project.code, title: project.title }, messages: [...messages, { role: "user", content: text }] }),
				});
				if (!res.ok) throw new Error(`HTTP ${res.status}`);
				const data = await res.json();
				const reply = typeof data?.message === "string" ? data.message : (data?.choices?.[0]?.message?.content ?? "Je n'ai pas pu obtenir de réponse.");
				appendMessage({ role: "assistant", content: String(reply) });
			} else if (apiKey) {
				// Direct call to OpenAI Chat Completions
				const model = "gpt-4o-mini";
				const openaiMessages = [
					{ role: "system", content: `You are a helpful assistant for project ${project.code} - ${project.title}. Answer concisely.` },
					...messages.map((m) => ({ role: m.role, content: m.content })),
					{ role: "user", content: text },
				];
				const res = await fetch("https://api.openai.com/v1/chat/completions", {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${apiKey}`,
					},
					body: JSON.stringify({ model, messages: openaiMessages, temperature: 0.2 }),
				});
				if (!res.ok) throw new Error(`OpenAI HTTP ${res.status}`);
				const data = await res.json();
				const reply = data?.choices?.[0]?.message?.content ?? "Aucune réponse reçue.";
				appendMessage({ role: "assistant", content: String(reply) });
			} else {
				// Fallback demo behavior: simple echo with context
				appendMessage({ role: "assistant", content: `(${project.code}) ${text}` });
			}
		} catch (err: unknown) {
			appendMessage({ role: "assistant", content: `Erreur lors de l'appel au chatbot${apiUrl || apiKey ? "" : " (aucun endpoint configuré / clé API manquante)"}.` });
		} finally {
			setIsLoading(false);
		}
	}

	function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
		if (e.key === "Enter" && !e.shiftKey) {
			e.preventDefault();
			handleSend();
		}
	}

	return (
		<div className="mt-6 rounded-lg border shadow-sm hover:ring-4 hover:ring-ring">
			<div className="border-b px-3 py-2">
				<h2 className="text-sm font-medium">Assistant du projet</h2>
				<p className="text-xs text-muted-foreground">Discutez à propos de {project.code} - {project.title}</p>
				{!apiKey && !apiUrl ? (
					<div className="mt-2 flex items-center gap-2">
						<input
							type="password"
							placeholder="OpenAI API key (sk-...)"
							value={apiKey}
							onChange={(e) => setApiKey(e.target.value)}
							className="w-full rounded-md border px-2 py-1 text-xs"
						/>
						<button
							type="button"
							onClick={() => localStorage.setItem("openai_api_key", apiKey)}
							className="inline-flex items-center rounded-md border px-2 py-1 text-xs"
						>
							Save
						</button>
					</div>
				) : null}
			</div>
			<div ref={scrollRef} className="h-64 overflow-y-auto px-3 py-3">
				<div className="flex flex-col gap-3">
					{messages.map((m, idx) => (
						<div key={idx} className={m.role === "user" ? "ml-auto max-w-[85%] rounded-lg border bg-accent px-3 py-2 text-sm" : "mr-auto max-w-[85%] rounded-lg border px-3 py-2 text-sm"}>
							{m.content}
						</div>
					))}
					{isLoading ? (
						<div className="mr-auto max-w-[85%] rounded-lg border px-3 py-2 text-sm text-muted-foreground">
							{loadingDots || "..."}
						</div>
					) : null}
				</div>
			</div>
			<div className="flex items-center gap-2 border-t p-3">
				<Input
					placeholder={"Écrire un message..."}
					value={input}
					onChange={(e) => setInput(e.target.value)}
					onKeyDown={handleKeyDown}
				/>
				<button
					type="button"
					onClick={handleSend}
					disabled={!canSend}
					className="inline-flex items-center rounded-md border px-3 py-2 text-sm disabled:opacity-50"
				>
					{isLoading ? "Envoi..." : "Envoyer"}
				</button>
			</div>
		</div>
	);
}

export default ChatPanel;

