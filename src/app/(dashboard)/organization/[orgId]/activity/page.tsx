import { ActivityList } from "@/app/(dashboard)/_components/activity-list";
import { Info } from "@/app/(dashboard)/_components/info";
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