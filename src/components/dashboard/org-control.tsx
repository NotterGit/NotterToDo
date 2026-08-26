"use client"

import { useOrganization, useOrganizationList } from "@clerk/nextjs"
import { useParams } from "next/navigation"
import { useEffect } from "react"

interface OrgControlProps {
    orgId?: string
}

export function OrgControl({ orgId: propOrgId }: OrgControlProps = {}) {
    const params = useParams()
    const { setActive } = useOrganizationList()
    const { organization: activeOrg } = useOrganization()

    const targetOrgId = propOrgId || (params?.orgId as string | undefined)

    useEffect(() => {
        if (!setActive || !targetOrgId) return

        if (targetOrgId.startsWith("org_")) {
            if (activeOrg?.id !== targetOrgId) {
                setActive({
                    organization: targetOrgId
                })
            }
        } else {
            if (activeOrg) {
                setActive({
                    organization: null
                })
            }
        }
    }, [setActive, targetOrgId, activeOrg])
    
    return null
}