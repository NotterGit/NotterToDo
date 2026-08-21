"use client"

import { useOrganization, useOrganizationList } from "@clerk/nextjs"
import { useParams } from "next/navigation"
import { useEffect } from "react"

export function OrgControl() {
    const params = useParams()
    const { setActive } = useOrganizationList()
    const { organization: activeOrg } = useOrganization()

    useEffect(() => {
        if (!setActive) return

        const orgId = params.orgId as string | undefined
        if (!orgId) return

        if (orgId.startsWith("org_")) {
            if (activeOrg?.id !== orgId) {
                setActive({
                    organization: orgId
                })
            }
        } else {
            if (activeOrg) {
                setActive({
                    organization: null
                })
            }
        }
    }, [setActive, params.orgId, activeOrg])
    
    return null
}