"use client"

import { Button } from "@/components/ui/button"
import { Sheet, SheetClose, SheetContent } from "@/components/ui/sheet"
import { useMobileSidebar } from "@/hooks/use-mobile-sidebar"
import { Menu, X } from "lucide-react"
import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"
import { Sidebar } from "./sidebar"
import { STORAGE_KEYS } from "@/config/const/app.const"
import { OrganizationSwitcher } from "@clerk/nextjs"
import { pages } from "@/config/routing/pages.route"

export function MobileSidebar() {
    const pathname = usePathname()
    const [isMounted, setIsMounted] = useState(false)

    const onOpen = useMobileSidebar((state) => state.onOpen)
    const onClose = useMobileSidebar((state) => state.onClose)
    const isOpen = useMobileSidebar((state) => state.isOpen)

    useEffect(() => {
        setIsMounted(true)
    }, [])

    useEffect(() => {
        onClose()
    }, [pathname, onClose])

    if (!isMounted) { 
        return null
    }
    
    return (
        <>
            <Button
                onClick={onOpen}
                className="block md:hidden"
                variant="ghost"
                size="sm"
            >
                <Menu className="w-4 h-4"/>
            </Button>
            <Sheet open={isOpen} onOpenChange={onClose}>
                <SheetContent
                    side="left"
                    className="p-4 flex flex-col gap-4"
                    showCloseButton={false}
                >
                    <div className="flex items-center justify-between gap-x-2">
                        <OrganizationSwitcher 
                            hidePersonal={false}
                            afterCreateOrganizationUrl={pages.DASHBOARD_CLERK_PATTERN}
                            afterSelectOrganizationUrl={pages.DASHBOARD_CLERK_PATTERN}
                            afterSelectPersonalUrl={pages.DASHBOARD_CLERK_PATTERN}
                            afterLeaveOrganizationUrl={pages.DASHBOARD()}
                            appearance={{
                                elements: {
                                    rootBox: {
                                        display: "flex",
                                        justifyContent: "flex-start",
                                        alignItems: "center"
                                    }
                                }
                            }}
                        />
                        <SheetClose
                            render={
                                <Button
                                    variant="outline"
                                    size="icon-sm"
                                    className="shrink-0"
                                />
                            }
                        >
                            <X className="h-4 w-4" />
                            <span className="sr-only">Close</span>
                        </SheetClose>
                    </div>
                    <div className="flex-1 overflow-y-auto">
                        <Sidebar
                            storageKey={STORAGE_KEYS.MOBILE_SIDEBAR}
                        />
                    </div>
                </SheetContent>
            </Sheet>
        </>
    )
}