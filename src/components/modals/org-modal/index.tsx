"use client"

import { Dialog, DialogContent } from "@/components/ui/dialog"
import { useOrgModal } from "@/hooks/use-org-modal"
import { CreateOrganization } from "@clerk/nextjs"
import { pages } from "@/config/routing/pages.route"
import { usePathname } from "next/navigation"
import { useEffect } from "react"

export function OrgModal() {
    const pathname = usePathname()
    const isOpen = useOrgModal((state) => state.isOpen)
    const onClose = useOrgModal((state) => state.onClose)

    useEffect(() => {
        onClose()
    }, [pathname, onClose])

    if (!isOpen) {
        return null
    }

    return (
        <Dialog
            open={isOpen}
            onOpenChange={(open) => {
                if (!open) {
                    onClose()
                }
            }}
        >
            <DialogContent className="p-0 bg-transparent border-none shadow-none max-w-fit w-auto" showCloseButton={false}>
                <CreateOrganization
                    afterCreateOrganizationUrl={pages.DASHBOARD_CLERK_PATTERN}
                />
            </DialogContent>
        </Dialog>
    )
}
