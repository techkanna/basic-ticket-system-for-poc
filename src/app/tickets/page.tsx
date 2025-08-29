import Link from "next/link";
import { cookies } from "next/headers";
import { COOKIE_NAME, getUserFromToken } from "@/lib/auth";
import { db } from "@/db/client";
import { tickets } from "@/db/schema";
import { eq, desc } from "drizzle-orm";

export default async function TicketsPage() {
	const cookieStore = await cookies();
	const token = cookieStore.get(COOKIE_NAME)?.value ?? null;
	const user = await getUserFromToken(token);
	if (!user) return null;

	const list = db
		.select()
		.from(tickets)
		.where(eq(tickets.userId, Number(user.sub)))
		.orderBy(desc(tickets.createdAt))
		.all();

	return (
		<div className="max-w-3xl mx-auto p-6 space-y-6">
			<div className="flex items-center justify-between">
				<div className="flex items-center">
					<Link href="/" className="underline mr-2">Back to home</Link>
					<h1 className="text-2xl font-semibold">Your tickets</h1>
				</div>
				<Link href="/" className="underline">Create new</Link>
			</div>
			{list.length === 0 ? (
				<p className="text-sm text-neutral-500">No tickets yet.</p>
			) : (
				<ul className="divide-y divide-black/10 dark:divide-white/15 rounded-md border border-black/10 dark:border-white/15">
					{list.map((t) => (
						<li key={t.id} className="p-4 flex items-center justify-between">
							<div>
								<p className="font-medium">{t.title}</p>
								<p className="text-xs text-neutral-500">{new Date(t.createdAt).toLocaleString()}</p>
							</div>
							<Link href={`/tickets/${t.id}`} className="underline">View</Link>
						</li>
					))}
				</ul>
			)}
		</div>
	);
}


