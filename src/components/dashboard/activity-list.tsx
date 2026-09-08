import { Skeleton } from "@/components/ui/skeleton";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { pages } from "@/config/routing/pages.route";
import { getUserById } from "@/api/user";
import { getOrgById } from "@/api/org";
import {
  FREE_AUDIT_LOG_LIMIT,
  EXTENDED_AUDIT_LOG_LIMIT,
  getPlanLimits,
  hasExtendedAuditLog,
} from "@/config/const/limits.const";
import { ActivityView } from "./activity-view";

interface ActivityListProps {
  orgId?: string
}

export async function ActivityList({ orgId: propOrgId }: ActivityListProps = {}) {
  const { userId, orgId: clerkOrgId } = await auth()
  const orgId = propOrgId || clerkOrgId || userId

  if (!orgId) {
    redirect(pages.AUTH.SIGN_IN)
  }

  const isOrg = orgId.startsWith("org_")
  const profile = isOrg ? await getOrgById(orgId) : await getUserById(orgId)
  const isExtended = hasExtendedAuditLog(profile?.premium)
  const planLimits = getPlanLimits(profile?.premium, isOrg)

  const auditLogs = await db.auditLog.findMany({
    where: {
      orgId
    },
    orderBy: {
      createdAt: "desc"
    },
    take: isExtended ? EXTENDED_AUDIT_LOG_LIMIT : FREE_AUDIT_LOG_LIMIT
  })

  return (
    <ActivityView
      initialLogs={auditLogs}
      isExtendedAudit={isExtended}
      tariffName={planLimits.name}
    />
  )
}

ActivityList.Skeleton = function ActivityListSkeleton() {
  return (
    <div className="space-y-4 pt-2">
      <div className="flex items-center justify-between">
        <Skeleton className="h-6 w-36 rounded-xl" />
        <Skeleton className="h-6 w-24 rounded-xl" />
      </div>
      <div className="p-3 rounded-xl border border-border/40 space-y-3">
        <Skeleton className="h-9 w-full rounded-xl" />
        <div className="flex flex-wrap gap-2">
          <Skeleton className="h-7 w-28 rounded-lg" />
          <Skeleton className="h-7 w-28 rounded-lg" />
          <Skeleton className="h-7 w-28 rounded-lg" />
        </div>
      </div>
      <div className="space-y-2.5">
        <Skeleton className="w-full h-14 rounded-xl" />
        <Skeleton className="w-full h-14 rounded-xl" />
        <Skeleton className="w-full h-14 rounded-xl" />
        <Skeleton className="w-full h-14 rounded-xl" />
      </div>
    </div>
  )
}