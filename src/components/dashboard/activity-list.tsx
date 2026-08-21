import { ActivityItem } from "@/components/ui/activity-item";
import { Skeleton } from "@/components/ui/skeleton";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { pages } from "@/config/routing/pages.route";

interface ActivityListProps {
  orgId?: string
}

export async function ActivityList({ orgId: propOrgId }: ActivityListProps = {}) {
  const { userId, orgId: clerkOrgId } = await auth()
  const orgId = propOrgId || clerkOrgId || userId

  if (!orgId) {
    redirect(pages.SELECT_ORG)
  }

  const auditLogs = await db.auditLog.findMany({
    where: {
      orgId
    },
    orderBy: {
        createdAt: "desc"
    }
  })

  return (
    <ol className="space-y-4 mt-4">
      <p className="hidden last:block text-xs text-center text-muted-foreground">
        Здесь пока нет активности
      </p>
      {auditLogs.map((log) => (
        <ActivityItem key={log.id} data={log} />
      ))}
    </ol>
  )
}

ActivityList.Skeleton = function ActivityListSkeleton() {
  return (
    <ol className="space-y-4 mt-4">
      <Skeleton className="w-[18%] h-10" />
      <Skeleton className="w-[15%] h-10" />
      <Skeleton className="w-[17%] h-10" />
      <Skeleton className="w-[18%] h-10" />
      <Skeleton className="w-[17%] h-10" />
    </ol>
  )
}