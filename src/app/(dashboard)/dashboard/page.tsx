import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { pages } from "@/config/routing/pages.route";

export default async function DashboardPage() {
  const { userId, orgId } = await auth();

  if (!userId) {
    redirect(pages.AUTH.SIGN_IN);
  }

  redirect(pages.DASHBOARD(orgId || userId));
}
