import { Separator } from "@/components/ui/separator";
import { Info } from "@/components/dashboard/info";
import BoardList from "@/components/dashboard/board/board-list";
import { Suspense } from "react";

export default async function OrganizationIdPage({
    params
}: {
    params: Promise<{ orgId: string }>
}) {
    const { orgId } = await params
    return (
        <div className="w-full mb-20">
            <Info/>
            <Separator className="my-4 h-[1px]"/>
            <div className="px-2 md:px-4">
                <Suspense fallback={<BoardList.Skeleton/>}>
                    <BoardList orgId={orgId}/>
                </Suspense>
            </div> 
        </div>
    );
}