import { prisma } from "@/lib/prisma";

export const PLAN_LIMITS: Record<string, number> = {
  free: 1, // per month
  pro: Infinity,
  team: Infinity,
};

export interface PlanInfo {
  planId: string;
  status: string;
  analysisCountThisMonth: number;
  limit: number;
}

export async function getUserPlan(userId: string): Promise<PlanInfo> {
  const subscription = await prisma.subscription.findUnique({
    where: { userId },
  });

  const planId = subscription?.planId ?? "free";
  const status = subscription?.status ?? "free";

  // Count analyses this calendar month
  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);

  const analysisCountThisMonth = await prisma.analysis.count({
    where: {
      userId,
      createdAt: { gte: startOfMonth },
    },
  });

  return {
    planId,
    status,
    analysisCountThisMonth,
    limit: PLAN_LIMITS[planId] ?? 1,
  };
}

export async function canRunAnalysis(
  userId: string
): Promise<{ allowed: boolean; reason?: string; upgradeUrl?: string; planInfo?: PlanInfo }> {
  const planInfo = await getUserPlan(userId);

  if (planInfo.planId !== "free" && planInfo.status === "active") {
    return { allowed: true, planInfo };
  }

  if (planInfo.analysisCountThisMonth >= planInfo.limit) {
    return {
      allowed: false,
      reason: `You've used your ${planInfo.limit} free analysis this month. Upgrade to Pro for unlimited analyses.`,
      upgradeUrl: "/pricing",
      planInfo,
    };
  }

  return { allowed: true, planInfo };
}

export async function ensureSubscriptionRecord(userId: string): Promise<void> {
  await prisma.subscription.upsert({
    where: { userId },
    update: {},
    create: {
      userId,
      planId: "free",
      status: "free",
    },
  });
}
