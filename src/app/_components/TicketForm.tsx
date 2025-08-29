"use client";
import { useState } from "react";

export default function TicketForm() {
	const [title, setTitle] = useState("");
	const [description, setDescription] = useState("");
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [success, setSuccess] = useState<string | null>(null);

	async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();
		setError(null);
		setSuccess(null);
		try {
			setLoading(true);
			const res = await fetch("/api/tickets", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ title, description }),
			});
			if (!res.ok) {
				const data = await res.json().catch(() => ({ error: "Failed" }));
				throw new Error(data.error || "Failed");
			}
			setTitle("");
			setDescription("");
			setSuccess("Ticket created");
			// Redirect after a short delay so users see feedback
			// setTimeout(() => {
			// 	window.location.href = "/tickets";
			// }, 200);
		} catch (err: unknown) {
			const message = err instanceof Error ? err.message : "Failed";
			setError(message);
		} finally {
			setLoading(false);
		}
	}

	return (
		<form onSubmit={onSubmit} className="space-y-3">
			<div>
				<label htmlFor="title" className="block text-sm font-medium mb-1">Title</label>
				<input id="title" value={title} onChange={(e) => setTitle(e.target.value)} required className="w-full rounded-md border border-black/10 dark:border-white/15 bg-transparent px-3 py-2 outline-none focus:ring-2 focus:ring-foreground/20" placeholder="Short summary" />
			</div>
			<div>
				<label htmlFor="description" className="block text-sm font-medium mb-1">Description</label>
				<textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} className="w-full min-h-24 rounded-md border border-black/10 dark:border-white/15 bg-transparent px-3 py-2 outline-none focus:ring-2 focus:ring-foreground/20" placeholder="Details (optional)" />
			</div>
			<button type="submit" disabled={loading} className="rounded-md bg-foreground text-background px-3 py-2 disabled:opacity-60">
				{loading ? "Creating..." : "Create Ticket"}
			</button>
			{error && <p className="text-sm text-red-500">{error}</p>}
			{success && <p className="text-sm text-green-600">{success}</p>}
		</form>
	);
}


