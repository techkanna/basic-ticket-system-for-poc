"use client";
import { useState } from "react";

export default function LogoutButton() {
	const [loading, setLoading] = useState(false);

	async function doLogout() {
		try {
			setLoading(true);
			await fetch("/api/auth/logout", { method: "POST" });
			window.location.href = "/login";
		} finally {
			setLoading(false);
		}
	}

	return (
		<button onClick={doLogout} disabled={loading} className="rounded border px-3 py-2 disabled:opacity-60">
			{loading ? "Signing out..." : "Logout"}
		</button>
	);
}


