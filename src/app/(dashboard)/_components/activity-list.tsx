import { ActivityItem } from "@/components/ui/activity-item";
import { Skeleton } from "@/components/ui/skeleton";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export async function ActivityList() {
  const { orgId } = auth()

  if (!orgId) {
    redirect("/select-org")
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
        No activity found inside this organization
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
      <Skeleton className="w-[180%] h-10" />
      <Skeleton className="w-[150%] h-10" />
      <Skeleton className="w-[170%] h-10" />
      <Skeleton className="w-[180%] h-10" />
      <Skeleton className="w-[175%] h-10" />
    </ol>
  )
}