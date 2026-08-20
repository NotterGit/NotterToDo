import { auth } from "@clerk/nextjs/server"
import { OrgControl } from "@/components/dashboard/org-control"
import { startCase } from "lodash"

export async function generateMetadata() {
    const { orgSlug } = await auth()

    return {
        title: startCase(orgSlug || "organization")
    }
}

export default function OrganizationIdLayout({ 
    children 
}: { 
    children: React.ReactNode 
}) {
    return (
        <>
            <OrgControl/>
            {children}
        </>
    )
}