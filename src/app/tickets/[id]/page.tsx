import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import { COOKIE_NAME, getUserFromToken } from "@/lib/auth";
import { db } from "@/db/client";
import { tickets } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import Link from "next/link";

export default async function TicketDetailPage({ params }: { params: Promise<{ id: string }> }) {
	const cookieStore = await cookies();
	const token = cookieStore.get(COOKIE_NAME)?.value ?? null;
	const user = await getUserFromToken(token);
	if (!user) return null;

	const { id } = await params;
	const ticketId = Number(id);
	if (Number.isNaN(ticketId)) return notFound();

	const rows = await db.select().from(tickets).where(and(eq(tickets.id, ticketId), eq(tickets.userId, Number(user.sub)))).limit(1);
	const ticket = rows[0];
	if (!ticket) return notFound();

	return (
		<div className="max-w-3xl mx-auto p-6 space-y-4">
			<Link href="/tickets" className="underline">Back to tickets</Link>
			<h1 className="text-2xl font-semibold">{ticket.title}</h1>
			<p className="text-sm text-neutral-500">Created {new Date(ticket.createdAt).toLocaleString()}</p>
			{ticket.description && <p className="whitespace-pre-wrap">{ticket.description}</p>}
		</div>
	);
}


