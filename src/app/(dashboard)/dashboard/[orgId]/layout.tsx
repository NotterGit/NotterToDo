import { auth, currentUser } from "@clerk/nextjs/server"
import { OrgControl } from "@/components/dashboard/org-control"
function formatOrgSlug(slug: string): string {
    return slug
        .replace(/[-_]+/g, " ")
        .replace(/\b\w/g, (c) => c.toUpperCase());
}

export async function generateMetadata() {
    const { orgSlug } = await auth()
    const user = await currentUser()

    if (orgSlug) {
        return {
            title: formatOrgSlug(orgSlug)
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