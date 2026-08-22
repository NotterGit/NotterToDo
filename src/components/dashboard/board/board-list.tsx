import { FormPopover } from "@/components/form/form-popover";
import { Hint } from "@/components/ui/hint";
import { Skeleton } from "@/components/ui/skeleton";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { HelpCircle, User2 } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { MAX_FREE_BOARDS } from "@/config/const/limits.const";
import { pages } from "@/config/routing/pages.route";

interface BoardListProps {
    orgId?: string
}

export default async function BoardList({ orgId: propOrgId }: BoardListProps = {}) {
    const { userId, orgId: clerkOrgId } = await auth()
    const orgId = propOrgId || clerkOrgId || userId

    if(!orgId) {
        return redirect(pages.SELECT_ORG)
    }

    const boards = await db.board.findMany({
        where: {
            orgId
        },
        orderBy: {
            createdAt: "desc"
        }
    })

  return (
    <div className="space-y-4">
        <div className="flex items-center font-semibold text-lg text-neutral-700 dark:text-neutral-200">
            <User2 className="h-6 w-6 mr-2"/>
            Ваши доски
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {boards.map((board) => (
                <Link
                    key={board.id}
                    href={pages.BOARD(board.id)}
                    className="group relative aspect-video bg-no-repeat bg-center bg-cover bg-neutral-700 rounded-sm h-full w-full p-2 overflow-hidden"
                    style={{ backgroundImage: `url(${board.image})` }}
                >
                    <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition" />
                    <p className="relative font-semibold text-white">
                        {board.title}
                    </p>
                </Link>
            ))}
            <FormPopover side="right" sideOffset={10}>
                <div
                    role="button"
                    className="aspect-video relative h-full w-full bg-muted rounded-sm flex flex-col gap-y-1 items-center justify-center hover:opacity-75 transition"
                >
                    <p className="text-sm">Создать доску</p>
                    <span className="text-xs">
                        {`Осталось: ${MAX_FREE_BOARDS}`}
                    </span>
                    <Hint
                        sideOffset={40}
                        description={`В бесплатной версии доступно до ${MAX_FREE_BOARDS} досок. Чтобы увеличить лимит, оформите подписку Notter Gem для организаций.`}
                    >
                        <HelpCircle
                            className="absolute bottom-2 right-2 h-[14px] w-[14px]"
                        />
                    </Hint>
                </div>
            </FormPopover>
        </div>
    </div>
  )
}

BoardList.Skeleton = function SkeletonBoardList() {
  return (
    <>
        <div className="flex items-center font-semibold text-lg text-neutral-700 dark:text-neutral-200">
            <User2 className="h-6 w-6 mr-2"/>
            Ваши доски
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mt-3">
        <Skeleton className="aspect-video h-full w-full p-2" />
        <Skeleton className="aspect-video h-full w-full p-2" />
        <Skeleton className="aspect-video h-full w-full p-2" />
        <Skeleton className="aspect-video h-full w-full p-2" />
        <Skeleton className="aspect-video h-full w-full p-2" />
        <Skeleton className="aspect-video h-full w-full p-2" />
        <Skeleton className="aspect-video h-full w-full p-2" />
        <Skeleton className="aspect-video h-full w-full p-2" />
        </div>
    </>
  )
}