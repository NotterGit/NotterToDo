"use client"

import { Skeleton } from "@/components/ui/skeleton"
import { useOrganization, useOrganizationList, useUser } from "@clerk/nextjs"
import { Gem, Globe, Infinity, Presentation, User } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useParams } from "next/navigation"
import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"
import { getPlanLimits } from "@/config/const/limits.const"
import { links } from "@/config/const/links.const"
import { useAccountProfile } from "@/hooks/use-account-profile"

interface InfoProps {
    boardCount?: number
    publicBoardCount?: number
}

export function Info({ boardCount, publicBoardCount }: InfoProps = {}) {
    const params = useParams()
    const { organization: activeOrg, isLoaded: isLoadedOrg } = useOrganization()
    const { user, isLoaded: isLoadedUser } = useUser()
    const { userMemberships, isLoaded: isLoadedList } = useOrganizationList({
        userMemberships: {
            infinite: true
        }
    })

    const orgId = params?.orgId as string | undefined
    const isPersonal = orgId ? !orgId.startsWith("org_") : !activeOrg

    const currentOrg = (orgId && activeOrg?.id === orgId)
        ? activeOrg
        : userMemberships?.data?.find((m) => m.organization.id === orgId)?.organization || activeOrg

    const entityId = isPersonal ? user?.id : currentOrg?.id
    const { data: profile } = useAccountProfile(entityId, !isPersonal)
    const planLimits = getPlanLimits(profile?.premium, !isPersonal)

    const name = isPersonal
        ? (user?.fullName || user?.firstName || user?.username || "Личный профиль")
        : (currentOrg?.name || "")

    const imageUrl = isPersonal
        ? (user?.imageUrl || "")
        : (currentOrg?.imageUrl || "")

    const identifier = isPersonal
        ? (user?.username || profile?.username || "")
        : (currentOrg?.slug || profile?.username || "")

    const profileUrl = identifier ? links.NOTTER_PROFILE(identifier) : undefined

    const tariff = planLimits.name
    const accountType = isPersonal ? "Личный профиль" : "Организация"

    const [imageLoaded, setImageLoaded] = useState(false)

    useEffect(() => {
        setImageLoaded(false)
    }, [imageUrl])

    if (isPersonal) {
        if (!isLoadedUser || !user) {
            return <Info.Skeleton />
        }
    } else {
        if (!isLoadedOrg) {
            return <Info.Skeleton />
        }

        if (!currentOrg && (!isLoadedList || userMemberships?.isLoading)) {
            return <Info.Skeleton />
        }

        if (!currentOrg) {
            return <Info.Skeleton />
        }
    }

    const avatarContent = (
        <>
            {imageUrl ? (
                <>
                    {!imageLoaded && (
                        <Skeleton className="w-full h-full absolute inset-0 rounded-xl" />
                    )}
                    <Image 
                        key={imageUrl}
                        fill
                        src={imageUrl}
                        alt={name || "Organization"}
                        className={cn(
                            "rounded-xl object-cover shadow-sm transition-opacity duration-200",
                            !imageLoaded ? "opacity-0" : "opacity-100"
                        )}
                        onLoad={() => setImageLoaded(true)}
                    />
                </>
            ) : (
                <div className="w-full h-full rounded-xl bg-muted/80 flex items-center justify-center shadow-inner">
                    <User className="h-6 w-6 text-muted-foreground" />
                </div>
            )}
        </>
    )

    return (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-white/60 bg-white/70 p-4 sm:p-5 shadow-sm backdrop-blur-xl dark:border-white/10 dark:bg-zinc-900/50">
            <div className="flex items-center gap-x-4 min-w-0">
                <div className="w-[60px] h-[60px] relative shrink-0">
                    {profileUrl ? (
                        <Link
                            href={profileUrl}
                            target="_blank"
                            className="block w-full h-full relative rounded-xl overflow-hidden hover:opacity-80 transition-opacity"
                        >
                            {avatarContent}
                        </Link>
                    ) : (
                        avatarContent
                    )}
                </div>
                <div className="space-y-1.5 min-w-0">
                    {name ? (
                        <p className="font-bold text-xl tracking-tight truncate">
                            {name}
                        </p>
                    ) : (
                        <Skeleton className="h-7 w-[200px] rounded-lg" />
                    )}
                    <div className="flex flex-wrap items-center gap-2">
                        <Link
                            href={links.NOTTER_GEM}
                            target="_blank"
                            className={cn(
                                "inline-flex items-center text-xs font-semibold tracking-wide px-2.5 py-1 rounded-xl border transition-colors hover:opacity-80",
                                tariff === "Amber" &&
                                    "text-amber-600 dark:text-yellow-400 bg-yellow-500/15 dark:bg-yellow-500/10 border-yellow-500/30",
                                tariff === "Diamond" &&
                                    "text-cyan-600 dark:text-cyan-400 bg-cyan-500/15 dark:bg-cyan-500/10 border-cyan-500/30",
                                tariff === "Free" &&
                                    "text-foreground/90 bg-muted/60 dark:bg-zinc-800/60 border-border/50"
                            )}
                        >
                            <Gem
                                className={cn(
                                    "w-3.5 h-3.5 mr-1.5 shrink-0",
                                    tariff === "Amber" && "text-amber-600 dark:text-yellow-400",
                                    tariff === "Diamond" && "text-cyan-600 dark:text-cyan-400",
                                    tariff === "Free" && "text-muted-foreground"
                                )}
                            />
                            <span>{tariff}</span>
                        </Link>
                        {profileUrl ? (
                            <Link
                                href={profileUrl}
                                target="_blank"
                                className="inline-flex items-center text-xs font-medium text-muted-foreground bg-muted/40 dark:bg-zinc-800/40 px-2.5 py-1 rounded-xl border border-border/40 hover:bg-muted/60 dark:hover:bg-zinc-800/60 hover:text-foreground transition-colors"
                            >
                                <span>{accountType}</span>
                            </Link>
                        ) : (
                            <div className="inline-flex items-center text-xs font-medium text-muted-foreground bg-muted/40 dark:bg-zinc-800/40 px-2.5 py-1 rounded-xl border border-border/40">
                                <span>{accountType}</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 sm:self-center pt-2 sm:pt-0 border-t sm:border-t-0 border-border/40">
                <div className="flex items-center gap-x-2 text-xs bg-muted/50 dark:bg-zinc-800/50 px-3 py-2 rounded-xl border border-border/50 shadow-xs">
                    <Presentation className="h-4 w-4 text-muted-foreground shrink-0" />
                    <span className="text-muted-foreground">Досок:</span>
                    <span className="font-semibold text-foreground flex items-center gap-1">
                        {boardCount !== undefined ? (
                            planLimits.isUnlimitedBoards ? (
                                <>
                                    <span>{boardCount}</span>
                                    <span>/</span>
                                    <Infinity className="h-3.5 w-3.5 inline text-foreground" />
                                </>
                            ) : (
                                `${boardCount} / ${planLimits.boards}`
                            )
                        ) : planLimits.isUnlimitedBoards ? (
                            <Infinity className="h-3.5 w-3.5 inline text-foreground" />
                        ) : (
                            `до ${planLimits.boards}`
                        )}
                    </span>
                </div>

                <div className="flex items-center gap-x-2 text-xs bg-muted/50 dark:bg-zinc-800/50 px-3 py-2 rounded-xl border border-border/50 shadow-xs">
                    <Globe className="h-4 w-4 text-muted-foreground shrink-0" />
                    <span className="text-muted-foreground">Публичных досок:</span>
                    <span className="font-semibold text-foreground">
                        {publicBoardCount !== undefined
                            ? `${publicBoardCount} / ${planLimits.publicBoards}`
                            : `до ${planLimits.publicBoards}`}
                    </span>
                </div>
            </div>
        </div>
    )
}

Info.Skeleton = function SkeletonInfo() {
    return (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-white/60 bg-white/70 p-4 sm:p-5 shadow-sm backdrop-blur-xl dark:border-white/10 dark:bg-zinc-900/50">
            <div className="flex items-center gap-x-4">
                <div className="w-[60px] h-[60px] relative shrink-0">
                    <Skeleton className="w-full h-full absolute rounded-xl"/>
                </div>
                <div className="space-y-2">
                    <Skeleton className="h-7 w-[200px] rounded-lg"/>
                    <div className="flex gap-2">
                        <Skeleton className="h-5 w-[80px] rounded-xl"/>
                        <Skeleton className="h-5 w-[100px] rounded-xl"/>
                    </div>
                </div>
            </div>
            <div className="flex gap-2 pt-2 sm:pt-0">
                <Skeleton className="h-8 w-[130px] rounded-xl" />
                <Skeleton className="h-8 w-[130px] rounded-xl" />
            </div>
        </div>
    )
}