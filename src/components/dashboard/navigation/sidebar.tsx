"use client"

import { Accordion } from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { useOrganization, useOrganizationList, useUser } from "@clerk/nextjs"
import { Plus } from "lucide-react"
import { useParams } from "next/navigation"
import { useLocalStorage } from "usehooks-ts"
import { NavItem } from "./navitem"
import { STORAGE_KEYS } from "@/config/const/app.const"
import { useOrgModal } from "@/hooks/use-org-modal"
import type { Organization, SidebarProps } from "@/config/types/main.types"

export function Sidebar({ storageKey = STORAGE_KEYS.SIDEBAR }: SidebarProps) {
    const params = useParams()
    const [expended, setExpended] = useLocalStorage<Record<string, boolean>>(storageKey, {})

    const { organization: activeOrg, isLoaded: isLoadedOrg } = useOrganization() 
    const { userMemberships, isLoaded: isLoadedList } = useOrganizationList({
        userMemberships: {
            infinite: true
        }
    })
    const { user, isLoaded: isLoadedUser } = useUser()

    const { onOpen: onOpenOrgModal } = useOrgModal()

    const defaultAccordionValue: string[] = Object.keys(expended)
        .reduce((acc: string[], key: string) => {
            if(expended[key]) {
                acc.push(key)
            }

            return acc
        }, [])

    const onExpand = (id: string) => {
        setExpended((curr) => ({
            ...curr,
            [id]: !expended[id]
        }))
    }

    if(!isLoadedOrg || !isLoadedList || !isLoadedUser || userMemberships.isLoading) {
        return (
            <>
                <div className="flex items-center justify-between mb-2">
                    <Skeleton className="h-10 w-[50%]"/>
                    <Skeleton className="h-10 w-10"/>
                </div>
                <div className="space-y-2">
                    <NavItem.Skeleton/>
                    <NavItem.Skeleton/>
                    <NavItem.Skeleton/>
                </div>
            </>
        )
    }

    const currentOrgId = params?.orgId as string | undefined
    const isPersonalActive = currentOrgId ? (!currentOrgId.startsWith("org_") || currentOrgId === user?.id) : !activeOrg
    const isOrgActive = (id: string) => currentOrgId ? currentOrgId === id : activeOrg?.id === id

    return (
        <div className="space-y-4">
            <div>
                <div className="font-medium text-xs flex items-center mb-1">
                    <span>
                        Личный профиль
                    </span>
                </div>
                <Accordion 
                    multiple
                    defaultValue={defaultAccordionValue}
                    className="space-y-2"
                >
                    {user && (
                        <NavItem 
                            key={user.id}
                            isActive={isPersonalActive}
                            isExpanded={expended[user.id]}
                            organization={{
                                id: user.id,
                                name: user.fullName || user.firstName || "Личный профиль",
                                imageUrl: user.imageUrl,
                                slug: user.username || user.id
                            }}
                            onExpand={onExpand}
                        />
                    )}
                </Accordion>
            </div>

            <div>
                <div className="font-medium text-xs flex items-center mb-1">
                    <span>
                        Организации
                    </span>
                    <Button 
                        type="button" 
                        size="icon" 
                        variant="ghost" 
                        className="ml-auto"
                        onClick={() => onOpenOrgModal()}
                    >
                        <Plus className="h-4 w-4"/>
                    </Button>
                </div>
                <Accordion 
                    multiple
                    defaultValue={defaultAccordionValue}
                    className="space-y-2"
                >
                    {userMemberships.data.map(({ organization }) => (
                        <NavItem 
                            key={organization.id}
                            isActive={isOrgActive(organization.id)}
                            isExpanded={expended[organization.id]}
                            organization={organization as Organization}
                            onExpand={onExpand}
                        />
                    ))}
                </Accordion>
            </div>
        </div>
    )
}