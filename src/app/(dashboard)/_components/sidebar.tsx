"use client"

import { Accordion } from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { useOrganization, useOrganizationList } from "@clerk/nextjs"
import { Plus } from "lucide-react"
import Link from "next/link"
import { useLocalStorage } from "usehooks-ts"
import { NavItem, Organization } from "./nav-item"

interface SidebarProps {
    storageKey?: string
}

export function Sidebar({storageKey = "t-sidebar-state"}: SidebarProps) {
    const [expended, setExpended] = useLocalStorage<Record<string, any>>(storageKey, {})

    const { organization: activeOrg, isLoaded: isLoadedOrg } = useOrganization() 
    const { userMemberships, isLoaded: isLoadedList } = useOrganizationList({
        userMemberships: {
            infinite: true
        }
    })

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

    if(!isLoadedOrg || !isLoadedList || userMemberships.isLoading) {
        return (
            <>
                <Skeleton/>
            </>
        )
    }

    return (
        <>
            <div className="font-medium text-xs flex items-center mb-1">
                <span className="pl-4">
                    Workspace
                </span>
                <Button type="button" size="icon" variant="ghost" className="ml-auto">
                    <Link href="/auth/select-org">
                        <Plus className="h-4 w-4"/>
                    </Link>
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
                        isActive={activeOrg?.id === organization.id}
                        isExpanded={expended[organization.id]}
                        organization={organization as Organization}
                        onExpand={onExpand}
                    />
                ))}
            </Accordion>
        </>
    )
}