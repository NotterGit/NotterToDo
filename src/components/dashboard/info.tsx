"use client"

import { Skeleton } from "@/components/ui/skeleton"
import { useOrganization, useOrganizationList, useUser } from "@clerk/nextjs"
import { Gem, User } from "lucide-react"
import Image from "next/image"
import { useParams } from "next/navigation"
import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"

export function Info() {
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

    const name = isPersonal
        ? (user?.fullName || user?.firstName || user?.username || "Личный профиль")
        : (currentOrg?.name || "")

    const imageUrl = isPersonal
        ? (user?.imageUrl || "")
        : (currentOrg?.imageUrl || "")

    const tariff = "Бесплатно"

    const [imageLoaded, setImageLoaded] = useState(false)

    useEffect(() => {
        setImageLoaded(false)
    }, [imageUrl])

    // Check loading states
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

    return (
        <div className="flex items-center gap-x-4 rounded-2xl border border-white/60 bg-white/70 p-4 shadow-sm backdrop-blur-xl dark:border-white/10 dark:bg-zinc-900/50">
            <div className="w-[60px] h-[60px] relative shrink-0">
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
            </div>
            <div className="space-y-1.5">
                {name ? (
                    <p className="font-bold text-xl tracking-tight">
                        {name}
                    </p>
                ) : (
                    <Skeleton className="h-7 w-[200px] rounded-lg" />
                )}
                <div className="flex items-center">
                    {tariff ? (
                        <div className="inline-flex items-center text-xs font-semibold tracking-wide text-foreground/90">
                            <Gem className="w-4 h-4 mr-1.5 shrink-0"/>
                            <span>{tariff}</span>
                        </div>
                    ) : (
                        <Skeleton className="h-5 w-[90px] rounded-xl" />
                    )}
                </div>
            </div>
        </div>
    )
}

Info.Skeleton = function SkeletonInfo() {
    return (
        <div className="flex items-center gap-x-4 rounded-2xl border border-white/60 bg-white/70 p-4 shadow-sm backdrop-blur-xl dark:border-white/10 dark:bg-zinc-900/50">
            <div className="w-[60px] h-[60px] relative shrink-0">
                <Skeleton className="w-full h-full absolute rounded-xl"/>
            </div>
            <div className="space-y-2">
                <Skeleton className="h-7 w-[200px] rounded-lg"/>
                <Skeleton className="h-5 w-[90px] rounded-xl"/>
            </div>
        </div>
    )
}