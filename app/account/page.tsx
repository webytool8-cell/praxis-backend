import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Panel } from "@/components/ui/Panel";

export default async function AccountPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/sign-in?callbackUrl=/account");

  const [user, recentAnalyses] = await Promise.all([
    prisma.user.findUnique({
      where: { id: session.user.id },
      select: { name: true, email: true, image: true },
    }),
    prisma.analysis.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
      take: 10,
      select: { id: true, name: true, sourceType: true, createdAt: true },
    }),
  ]);

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 space-y-6">
      <Panel className="p-6">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-muted mb-4">Account</h2>
        <div className="flex items-center gap-4">
          {user?.image && (
            <img src={user.image} alt="Avatar" className="w-12 h-12 rounded-full" />
          )}
          <div>
            <p className="font-semibold text-white">{user?.name ?? "Anonymous"}</p>
            <p className="text-sm text-muted">{user?.email}</p>
          </div>
        </div>
      </Panel>

      <Panel className="p-6">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-muted mb-4">
          Recent Analyses
        </h2>
        {recentAnalyses.length === 0 ? (
          <p className="text-sm text-muted">No analyses yet. <Link href="/repo" className="text-accent hover:underline">Connect a project</Link> to get started.</p>
        ) : (
          <ul className="space-y-2">
            {recentAnalyses.map((a) => (
              <li key={a.id}>
                <Link
                  href={`/dashboard?analysisId=${a.id}`}
                  className="flex items-center justify-between p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
                >
                  <div>
                    <p className="text-sm font-medium text-white">{a.name}</p>
                    <p className="text-xs text-muted capitalize">{a.sourceType}</p>
                  </div>
                  <p className="text-xs text-muted">
                    {new Date(a.createdAt).toLocaleDateString()}
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </Panel>
    </div>
  );
}
