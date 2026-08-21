import { ActivityList } from "@/components/dashboard/activity-list";
import { Info } from "@/components/dashboard/info";
import { Separator } from "@/components/ui/separator";
import { Suspense } from "react";

export default async function ActivityPage({
    params
}: {
    params: Promise<{ orgId: string }>
}) {
    const { orgId } = await params
    return (
        <div className="w-full">
            <Info/>
            <Separator className="my-1 h-[1px]"/>
            <Suspense fallback={<ActivityList.Skeleton/>}>
                <ActivityList orgId={orgId}/>
            </Suspense>
        </div>
    )
}