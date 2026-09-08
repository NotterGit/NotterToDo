import { memo, useMemo } from "react"
import { AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"
import { useOrganization, useOrganizationList } from "@clerk/nextjs"
import { Activity, Gem, Layout } from "lucide-react"
import Image from "next/image"
import { usePathname, useRouter } from "next/navigation"
import { pages } from "@/config/routing/pages.route"
import { links } from "@/config/const/links.const"
import type { NavItemProps, Organization } from "@/config/types/main.types"

export type { Organization }

function SkeletonNavItem() {
    return (
        <div className="flex items-center gap-x-2 p-2 rounded-xl">
            <div className="w-7 h-7 relative shrink-0">
                <Skeleton className="h-full w-full rounded-lg"/>
            </div>
            <Skeleton className="h-7 w-full rounded-lg"/>
        </div>
    )
}

function NavItemBase({ isExpanded, isActive, organization, onExpand }: NavItemProps) {
    const router = useRouter()
    const pathname = usePathname()
    const { organization: activeOrg } = useOrganization()
    const { setActive } = useOrganizationList()

    const routes = useMemo(() => [
        {
            label: "Доски",
            icon: <Layout className="h-4 w-4 mr-2"/>,
            href: pages.DASHBOARD(organization.id)
        },
        {
            label: "Активность",
            icon: <Activity className="h-4 w-4 mr-2"/>,
            href: pages.DASHBOARD_ACTIVITY(organization.id)
        },
        {
            label: "Подписка",
            icon: <Gem className="h-4 w-4 mr-2"/>,
            href: links.NOTTER_GEM
        }
    ], [organization.id])

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
                className={cn("flex items-center gap-x-2 p-2 text-neutral-700 dark:text-neutral-200 rounded-xl hover:bg-neutral-500/10 transition text-start no-underline hover:no-underline", 
                isActive && !isExpanded && "bg-logo-yellow/10 text-foreground font-semibold border border-logo-yellow/30 dark:bg-logo-yellow/15 dark:border-logo-yellow/20")}
            >
                <div className="flex items-center gap-x-2">
                    <div className="w-7 h-7 relative shrink-0">
                        {organization.imageUrl ? (
                            <Image
                                fill
                                src={organization.imageUrl}
                                alt={organization.name}
                                className="rounded-lg object-cover"
                            />
                        ) : (
                            <div className="w-full h-full bg-muted rounded-lg flex items-center justify-center">
                                <Layout className="h-4 w-4 text-muted-foreground" />
                            </div>
                        )}
                    </div>
                    <span className="font-semibold text-sm">
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
                            "w-full font-medium justify-start pl-10 mb-1 rounded-xl transition-all",
                            pathname === route.href && "bg-logo-yellow/10 text-foreground font-semibold border border-logo-yellow/30 dark:bg-logo-yellow/15 dark:border-logo-yellow/20"
                        )}
                        variant="ghost"
                        size="sm"
                    >
                        {route.icon}
                        {route.label}
                    </Button>
                ))}
            </AccordionContent>
        </AccordionItem>
    )
}

export const NavItem = Object.assign(memo(NavItemBase), {
    Skeleton: SkeletonNavItem
})