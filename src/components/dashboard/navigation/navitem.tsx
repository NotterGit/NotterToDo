"use client"

import { AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"
import { useOrganization, useOrganizationList } from "@clerk/nextjs"
import { Activity, Gem, Layout, Settings } from "lucide-react"
import Image from "next/image"
import { usePathname, useRouter } from "next/navigation"
import { pages } from "@/config/routing/pages.route"
import { links } from "@/config/const/links.const"
import type { NavItemProps, Organization } from "@/config/types/main.types"

export type { Organization }

export function NavItem({ isExpanded, isActive, organization, onExpand }: NavItemProps) {
    const router = useRouter()
    const pathname = usePathname()
    const { organization: activeOrg } = useOrganization()
    const { setActive } = useOrganizationList()

    const routes = [
        {
            label: "Доски",
            icon: <Layout className="h-4 w-4 mr-2"/>,
            href: pages.ORGANIZATION(organization.id)
        },
        {
            label: "Активность",
            icon: <Activity className="h-4 w-4 mr-2"/>,
            href: pages.ORGANIZATION_ACTIVITY(organization.id)
        },
        {
            label: "Настройки",
            icon: <Settings className="h-4 w-4 mr-2"/>,
            href: pages.ORGANIZATION_SETTINGS(organization.id)
        },
        {
            label: "Подписка",
            icon: <Gem className="h-4 w-4 mr-2"/>,
            href: links.NOTTER_GEM
        }
    ]

    const onClick = async (href: string) => {
        if (setActive) {
            if (organization.id.startsWith("org_")) {
                if (activeOrg?.id !== organization.id) {
                    await setActive({ organization: organization.id })
                }
            } else {
                if (activeOrg) {
                    await setActive({ organization: null })
                }
            }
        }
        router.push(href)
    }
    
    return (
        <AccordionItem value={organization.id} className="border-none">
            <AccordionTrigger 
                onClick={() => onExpand(organization.id)} 
                className={cn("flex items-center gap-x-2 p-1.5 text-neutral-700 dark:text-neutral-200 rounded-md hover:bg-neutral-500/10 transition text-start no-underline hover:no-underline", 
                isActive && !isExpanded && "bg-sky-500/10 text-sky-700 dark:bg-sky-500/20 dark:text-sky-400")}
            >
                <div className="flex items-center gap-x-2">
                    <div className="w-7 h-7 relative">
                        {organization.imageUrl ? (
                            <Image
                                fill
                                src={organization.imageUrl}
                                alt={organization.name}
                                className="rounded-sm object-cover"
                            />
                        ) : (
                            <div className="w-full h-full bg-muted rounded-sm flex items-center justify-center">
                                <Layout className="h-4 w-4 text-muted-foreground" />
                            </div>
                        )}
                    </div>
                    <span className="font-medium text-sm">
                        {organization.name}
                    </span>
                </div>
            </AccordionTrigger>
            <AccordionContent className="pt-1 text-neutral-700 dark:text-neutral-200">
                {routes.map((route) => (
                    <Button
                        key={route.href}
                        onClick={() => onClick(route.href)}
                        className={cn(
                            "w-full font-normal justify-start pl-10 mb-1",
                            pathname === route.href && "bg-sky-500/10 text-sky-700 dark:bg-sky-500/20 dark:text-sky-400"
                        )}
                        variant="ghost"
                    >
                        {route.icon}
                        {route.label}
                    </Button>
                ))}
            </AccordionContent>
        </AccordionItem>
    )
}

NavItem.Skeleton = function SkeletonNavItem() {
    return (
        <div className="flex items-center gap-x-2">
            <div className="w-10 h-10 relative shrink-0">
                <Skeleton className="h-full w-full absolute"/>
            </div>
            <Skeleton className="h-10 w-full"/>
        </div>
    )
}