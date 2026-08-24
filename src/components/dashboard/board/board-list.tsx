import { FormPopover } from "@/components/form/form-popover";
import { Hint } from "@/components/ui/hint";
import { Skeleton } from "@/components/ui/skeleton";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { Globe, HelpCircle, Infinity, Presentation } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getPlanLimits } from "@/config/const/limits.const";
import { pages } from "@/config/routing/pages.route";
import { getUserById } from "@/api/user";
import { getOrgById } from "@/api/org";

interface BoardListProps {
    orgId?: string
}

export default async function BoardList({ orgId: propOrgId }: BoardListProps = {}) {
    const { userId, orgId: clerkOrgId } = await auth()
    const orgId = propOrgId || clerkOrgId || userId

    if(!orgId) {
        return redirect(pages.AUTH.SIGN_IN)
    }

    const isOrg = orgId.startsWith("org_") || Boolean(clerkOrgId && clerkOrgId === orgId);
    const profile = isOrg ? await getOrgById(orgId) : await getUserById(orgId);
    const planLimits = getPlanLimits(profile?.premium, isOrg);

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
        <div className="flex items-center font-bold text-lg text-foreground">
            <Presentation className="h-5 w-5 mr-2 text-muted-foreground"/>
            Доски
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {boards.map((board) => (
                <Link
                    key={board.id}
                    href={pages.BOARD(board.id)}
                    className="group relative aspect-video bg-no-repeat bg-center bg-cover bg-neutral-700 rounded-2xl h-full w-full p-3 overflow-hidden shadow-md hover:shadow-xl hover:scale-[1.02] transition-all duration-300 border border-white/20 dark:border-white/10"
                    style={{ backgroundImage: `url(${board.image})` }}
                >
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-black/20 group-hover:from-black/70 group-hover:via-black/40 group-hover:to-black/30 transition-all duration-300" />
                    <p className="relative font-bold text-white text-sm sm:text-base drop-shadow-sm pr-7">
                        {board.title}
                    </p>
                    {board.public && (
                        <div 
                            className="absolute top-2.5 right-2.5 z-10 flex items-center justify-center p-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 backdrop-blur-md shadow-sm"
                            title="Публичная доска"
                        >
                            <Globe className="h-3.5 w-3.5 text-emerald-400" />
                        </div>
                    )}
                </Link>
            ))}
            <FormPopover side="right" sideOffset={10}>
                <div
                    role="button"
                    className="aspect-video relative h-full w-full bg-card/50 dark:bg-zinc-900/40 rounded-2xl border border-dashed border-border/80 flex flex-col gap-y-1.5 items-center justify-center hover:bg-card/80 dark:hover:bg-zinc-900/70 hover:scale-[1.02] shadow-sm hover:shadow-md backdrop-blur-sm transition-all duration-300"
                >
                    <p className="text-sm font-semibold">Создать доску</p>
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                        Осталось:{" "}
                        {planLimits.isUnlimitedBoards ? (
                            <Infinity className="h-3.5 w-3.5 inline text-muted-foreground" />
                        ) : (
                            Math.max(0, planLimits.boards - boards.length)
                        )}
                    </span>
                    <Hint
                        sideOffset={40}
                        description={
                            planLimits.isUnlimitedBoards
                                ? "У вас неограниченное количество досок"
                                : `На вашем тарифе (${planLimits.name}) доступно до ${planLimits.boards} досок. Чтобы увеличить лимит, оформите подписку Notter Gem`
                        }
                    >
                        <HelpCircle
                            className="absolute bottom-2.5 right-2.5 h-4 w-4 text-muted-foreground/70 hover:text-muted-foreground transition"
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
        <div className="flex items-center font-bold text-lg text-foreground">
            <Presentation className="h-5 w-5 mr-2 text-muted-foreground"/>
            Доски
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mt-3">
        <Skeleton className="aspect-video h-full w-full rounded-2xl" />
        <Skeleton className="aspect-video h-full w-full rounded-2xl" />
        <Skeleton className="aspect-video h-full w-full rounded-2xl" />
        <Skeleton className="aspect-video h-full w-full rounded-2xl" />
        <Skeleton className="aspect-video h-full w-full rounded-2xl" />
        <Skeleton className="aspect-video h-full w-full rounded-2xl" />
        <Skeleton className="aspect-video h-full w-full rounded-2xl" />
        <Skeleton className="aspect-video h-full w-full rounded-2xl" />
        </div>
    </>
  )
}