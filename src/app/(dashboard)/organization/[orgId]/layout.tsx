import { auth, currentUser } from "@clerk/nextjs/server"
import { OrgControl } from "@/components/dashboard/org-control"
import { startCase } from "lodash"

export async function generateMetadata() {
    const { orgSlug } = await auth()
    const user = await currentUser()

    if (orgSlug) {
        return {
            title: startCase(orgSlug || "organization")
        }
    }

    return {
        title: user?.fullName || user?.firstName || "Личный профиль"
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