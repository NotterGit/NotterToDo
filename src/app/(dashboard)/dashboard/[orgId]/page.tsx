import { Info } from "@/components/dashboard/info";
import BoardList from "@/components/dashboard/board/board-list";
import { Suspense } from "react";
import { db } from "@/lib/db";

export default async function OrganizationIdPage({
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
                <Suspense fallback={<BoardList.Skeleton/>}>
                    <BoardList orgId={orgId}/>
                </Suspense>
            </div> 
        </div>
    );
}