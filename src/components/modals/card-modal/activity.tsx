"use client"

import { ActivityItem } from "@/components/ui/activity-item"
import { Skeleton } from "@/components/ui/skeleton"
import { ActivityIcon } from "lucide-react"
import type { ActivityProps } from "@/config/types/modals.types"

export function Activity({
    items
}: ActivityProps) {
    return (
        <div className="flex items-start gap-x-3 w-full">
            <ActivityIcon className="h-5 w-5 mt-0.5 text-neutral-700 dark:text-neutral-300" />
            <div className="w-full">
                <p className="font-semibold text-neutral-700 dark:text-neutral-200 mb-2">
                    Activity
                </p>
                <ol className="mt-2 space-y-4">
                    {items.map((item) => (
                        <ActivityItem key={item.id} data={item}/>
                    ))}
                </ol>
            </div>
        </div>
    )
}

Activity.Skeleton = function ActivitySkeleton() {
    return (
        <div className="flex items-center gap-x-3 w-full">
            <Skeleton className="h-6 w-6"/>
            <div className="w-full space-y-2">
                <Skeleton className="w-24 h-6"/>
                <Skeleton className="w-full h-10"/>
            </div>
        </div>
    )
}