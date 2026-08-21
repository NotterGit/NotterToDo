"use client"

import { Skeleton } from "@/components/ui/skeleton"
import { useOrganization, useUser } from "@clerk/nextjs"
import { Gem, User } from "lucide-react"
import Image from "next/image"
import { useParams } from "next/navigation"

export function Info() {
    const params = useParams()
    const { organization, isLoaded: isLoadedOrg } = useOrganization()
    const { user, isLoaded: isLoadedUser } = useUser()

    if(!isLoadedOrg || !isLoadedUser){
        return (
            <Info.Skeleton/>
        )
    }

    const orgId = params?.orgId as string | undefined
    const isPersonal = orgId ? !orgId.startsWith("org_") : !organization
    const name = isPersonal
        ? (user?.fullName || user?.firstName || user?.username || "Личный профиль")
        : (organization?.name || "Организация")
    const imageUrl = isPersonal
        ? (user?.imageUrl || "")
        : (organization?.imageUrl || "")

    return (
        <div className="flex items-center gap-x-4">
            <div className="w-[60px] h-[60px] relative">
                {imageUrl ? (
                    <Image 
                        fill
                        src={imageUrl}
                        alt={name}
                        className="rounded-md object-cover"
                    />
                ) : (
                    <div className="w-full h-full rounded-md bg-muted flex items-center justify-center">
                        <User className="h-6 w-6 text-muted-foreground" />
                    </div>
                )}
            </div>
            <div className="space-y-1">
                <p className="font-semibold text-xl">
                    {name}
                </p>
                <div className="flex items-center text-xs text-muted-foreground">
                    <Gem className="w-3 h-3 mr-1"/>
                    {isPersonal ? "Личный профиль" : "Бесплатно"}
                </div>
            </div>
        </div>
    )
}

Info.Skeleton = function SkeletonInfo() {
    return (
        <div className="flex items-center gap-x-4">
            <div className="w-[60px] h-[60px] relative">
                <Skeleton className="w-full h-full absolute"/>
            </div>
            <div className="space-y-2">
                <Skeleton className="h-10 w-[200px]"/>
                <div className="flex items-center">
                    <Skeleton className="h-4 w-4 mr-1"/>
                    <Skeleton className="h-4 w-[100px]"/>
                </div>
            </div>
        </div>
    )
}