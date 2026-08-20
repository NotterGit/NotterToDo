import { ActivityList } from "@/components/dashboard/activity-list";
import { Info } from "@/components/dashboard/info";
import { Separator } from "@/components/ui/separator";
import { Suspense } from "react";

export default function ActivityPage() {
    return (
        <div className="w-ful">
            <Info/>
            <Separator className="my-1 h-[1px]"/>
            <Suspense fallback={<ActivityList.Skeleton/>}>
                <ActivityList/>
            </Suspense>
        </div>
    )
}