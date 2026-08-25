"use client"

import { ActivityItem } from "@/components/ui/activity-item"
import { Skeleton } from "@/components/ui/skeleton"
import { ActivityIcon, Gem } from "lucide-react"
import type { ActivityProps } from "@/config/types/modals.types"
import Link from "next/link"
import { links } from "@/config/const/links.const"

export function Activity({
    items,
    isExtended = false,
}: ActivityProps) {
    return (
        <div className="flex items-start gap-x-3 w-full">
            <ActivityIcon className="h-5 w-5 mt-0.5 text-neutral-700 dark:text-neutral-300 shrink-0" />
            <div className="w-full space-y-3">
                <div className="flex items-center justify-between">
                    <p className="font-semibold text-neutral-700 dark:text-neutral-200">
                        Действия
                    </p>
                    {isExtended && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-medium text-amber-600 dark:text-yellow-400 bg-yellow-500/10 px-2 py-0.5 rounded-lg border border-yellow-500/20">
                            <Gem className="h-3 w-3" />
                            <span>Полная история</span>
                        </span>
                    )}
                </div>
                <ol className="space-y-2.5">
                    {items.map((item) => (
                        <ActivityItem key={item.id} data={item} extended={isExtended} />
                    ))}
                </ol>

                {!isExtended && items.length >= 3 && (
                    <div className="flex items-center justify-between gap-2 p-2.5 rounded-xl border border-yellow-500/20 bg-yellow-500/5 text-xs text-muted-foreground">
                        <span>
                            Показаны последние 3 действия. Полная история доступна в тарифах Amber и Diamond.
                        </span>
                        <Link
                            href={links.NOTTER_GEM}
                            target="_blank"
                            className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-600 dark:text-yellow-400 hover:opacity-80 shrink-0"
                        >
                            <Gem className="h-3 w-3" />
                            <span>Подробнее</span>
                        </Link>
                    </div>
                )}
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