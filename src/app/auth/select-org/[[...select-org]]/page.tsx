import { OrganizationList } from "@clerk/nextjs";
import { pages } from "@/config/routing/pages.route";

export default function CreateOrganizationPage() {
    return (
        <OrganizationList
            afterSelectOrganizationUrl={pages.ORGANIZATION_CLERK_PATTERN}
            afterCreateOrganizationUrl={pages.ORGANIZATION_CLERK_PATTERN}
        />
    )
}