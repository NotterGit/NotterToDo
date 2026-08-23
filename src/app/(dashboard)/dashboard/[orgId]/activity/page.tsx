import { ActivityList } from "@/components/dashboard/activity-list";
import { Info } from "@/components/dashboard/info";
import { Activity } from "lucide-react";
import { Suspense } from "react";
import { db } from "@/lib/db";

export default async function ActivityPage({
    params
}: {
    params: Promise<{ orgId: string }>
}) {
    const { orgId } = await params
    const boardCount = await db.board.count({
        where: {
            orgId
        }
    })

    return (
        <div className="w-full mb-20 space-y-4">
            <Info boardCount={boardCount} />
            <div className="rounded-2xl border border-white/60 bg-white/70 p-4 sm:p-6 shadow-sm backdrop-blur-xl dark:border-white/10 dark:bg-zinc-900/50">
                <div className="flex items-center font-bold text-lg text-foreground">
                    <Activity className="h-5 w-5 mr-2 text-muted-foreground"/>
                    Активность
                </div>
                <Suspense fallback={<ActivityList.Skeleton/>}>
                    <ActivityList orgId={orgId}/>
                </Suspense>
            </div>
        </div>
    )
}