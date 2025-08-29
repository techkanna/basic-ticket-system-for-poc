import { cookies } from "next/headers";
import { COOKIE_NAME, getUserFromToken } from "@/lib/auth";
import LogoutButton from "./_components/LogoutButton";
import TicketForm from "./_components/TicketForm";
import Link from "next/link";

export default async function Home() {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value ?? null;
  const user = await getUserFromToken(token);

  return (
    <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start" style={{ width: "100%", maxWidth: 640 }}>
        <h1 className="text-2xl font-semibold">Welcome{user?.name ? `, ${user.name}` : ""}</h1>
        {user && (
          <div style={{ width: "100%" }} className="space-y-4">
            <LogoutButton />
            <TicketForm />
            <Link href="tickets" className="bg-blue-500 text-white px-4 py-2 rounded-md mr-3">View Tickets</Link>
          </div>
        )}
      </main>
    </div>
  );
}
