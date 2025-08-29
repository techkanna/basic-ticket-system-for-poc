"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginPage() {
	const router = useRouter();
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState<string | null>(null);
	const [loading, setLoading] = useState(false);

	async function onSubmit(e: React.FormEvent) {
		e.preventDefault();
		setError(null);
		try {
			setLoading(true);
			const res = await fetch("/api/auth/login", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ email, password }),
			});
			if (res.ok) {
				router.push("/");
			} else {
				const data = await res.json().catch(() => ({ error: "Login failed" }));
				setError(data.error ?? "Login failed");
			}
		} finally {
			setLoading(false);
		}
	}

	return (
		<div className="min-h-screen flex items-center justify-center p-6">
			<div className="w-full max-w-md rounded-2xl border border-black/[.08] dark:border-white/[.145] bg-background p-8 shadow-sm">
				<h1 className="text-2xl font-semibold mb-6">Sign in</h1>
				<form onSubmit={onSubmit} className="space-y-4">
					<div>
						<label htmlFor="email" className="block text-sm font-medium mb-1">Email</label>
						<input
							id="email"
							type="email"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							required
							disabled={loading}
							className="w-full rounded-md border border-black/10 dark:border-white/15 bg-transparent px-3 py-2 outline-none focus:ring-2 focus:ring-foreground/20 disabled:opacity-60"
							placeholder="you@example.com"
						/>
					</div>
					<div>
						<label htmlFor="password" className="block text-sm font-medium mb-1">Password</label>
						<input
							id="password"
							type="password"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							required
							disabled={loading}
							className="w-full rounded-md border border-black/10 dark:border-white/15 bg-transparent px-3 py-2 outline-none focus:ring-2 focus:ring-foreground/20 disabled:opacity-60"
							placeholder="••••••••"
						/>
					</div>
					<button type="submit" disabled={loading} className="w-full h-10 rounded-md bg-foreground text-background hover:opacity-90 transition disabled:opacity-60">
						{loading ? "Signing in..." : "Login"}
					</button>
				</form>
				{error && <p className="text-sm text-red-500 mt-3">{error}</p>}
				<p className="text-sm mt-6 text-center">
					Don&apos;t have an account? <a className="underline" href="/register">Register</a>
				</p>
			</div>
		</div>
	);
}


