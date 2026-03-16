import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { SharedDashboard } from "./SharedDashboard";

export default async function SharePage({ params }: { params: { token: string } }) {
  const analysis = await prisma.analysis.findUnique({
    where: { shareToken: params.token },
    select: {
      id: true,
      name: true,
      graphData: true,
      securityScan: true,
      aiSummary: true,
      createdAt: true,
      user: { select: { name: true } },
    },
  });

  if (!analysis) notFound();

  return (
    <div className="min-h-screen flex flex-col">
      <div className="border-b border-white/10 px-6 py-3 flex items-center justify-between">
        <div>
          <Link href="/" className="flex items-center gap-2 text-sm font-semibold tracking-wider text-slate-100">
            <span className="inline-block h-2.5 w-2.5 rounded-full bg-accent shadow-glow" />
            PRAXIS
          </Link>
        </div>
        <div className="text-sm text-muted">
          <span className="text-slate-300 font-medium">{analysis.name}</span>
          {analysis.user?.name && <span> · by {analysis.user.name}</span>}
          <span> · {new Date(analysis.createdAt).toLocaleDateString()}</span>
        </div>
        <Link
          href="/sign-in"
          className="rounded-lg border border-accent/30 bg-accent/10 px-4 py-1.5 text-sm text-accent hover:bg-accent/20 transition-colors"
        >
          Try PRAXIS Free →
        </Link>
      </div>

      <div className="flex-1 p-4">
        <SharedDashboard
          analysisId={analysis.id}
          graphData={analysis.graphData as any}
          securityFindings={(analysis.securityScan as any[]) ?? []}
        />
      </div>

      <div className="border-t border-white/10 py-4 text-center text-xs text-muted">
        Powered by{" "}
        <Link href="/" className="text-accent hover:underline">
          PRAXIS
        </Link>{" "}
        · Developer System Intelligence
      </div>
    </div>
  );
}
