import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { DashboardView } from "@/views/DashboardView";

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user) redirect("/sign-in?callbackUrl=/dashboard");

  return (
    <Suspense>
      <DashboardView />
    </Suspense>
  );
}
