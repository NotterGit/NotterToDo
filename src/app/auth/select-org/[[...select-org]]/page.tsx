import { OrganizationList } from "@clerk/nextjs";
import { pages } from "@/config/routing/pages.route";

export default function CreateOrganizationPage() {
    return (
        <OrganizationList
            hidePersonal={false}
            afterSelectPersonalUrl={pages.ORGANIZATION_CLERK_PATTERN}
            afterSelectOrganizationUrl={pages.ORGANIZATION_CLERK_PATTERN}
            afterCreateOrganizationUrl={pages.ORGANIZATION_CLERK_PATTERN}
        />
    )
}