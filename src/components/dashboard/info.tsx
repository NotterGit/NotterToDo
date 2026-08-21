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

    const tariff = isPersonal ? "Личный профиль" : "Бесплатно"

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
        <div className="flex items-center gap-x-4">
            <div className="w-[60px] h-[60px] relative shrink-0">
                {imageUrl ? (
                    <>
                        {!imageLoaded && (
                            <Skeleton className="w-full h-full absolute inset-0 rounded-md" />
                        )}
                        <Image 
                            key={imageUrl}
                            fill
                            src={imageUrl}
                            alt={name || "Organization"}
                            className={cn(
                                "rounded-md object-cover transition-opacity duration-200",
                                !imageLoaded ? "opacity-0" : "opacity-100"
                            )}
                            onLoad={() => setImageLoaded(true)}
                        />
                    </>
                ) : (
                    <div className="w-full h-full rounded-md bg-muted flex items-center justify-center">
                        <User className="h-6 w-6 text-muted-foreground" />
                    </div>
                )}
            </div>
            <div className="space-y-1">
                {name ? (
                    <p className="font-semibold text-xl">
                        {name}
                    </p>
                ) : (
                    <Skeleton className="h-7 w-[200px]" />
                )}
                <div className="flex items-center text-xs text-muted-foreground">
                    <Gem className="w-3 h-3 mr-1 shrink-0"/>
                    {tariff ? (
                        <span>{tariff}</span>
                    ) : (
                        <Skeleton className="h-3.5 w-[80px]" />
                    )}
                </div>
            </div>
        </div>
    )
}

Info.Skeleton = function SkeletonInfo() {
    return (
        <div className="flex items-center gap-x-4">
            <div className="w-[60px] h-[60px] relative shrink-0">
                <Skeleton className="w-full h-full absolute rounded-md"/>
            </div>
            <div className="space-y-2">
                <Skeleton className="h-7 w-[200px]"/>
                <div className="flex items-center gap-x-1">
                    <Skeleton className="h-3.5 w-3.5 rounded-sm"/>
                    <Skeleton className="h-3.5 w-[100px]"/>
                </div>
            </div>
        </div>
    )
}