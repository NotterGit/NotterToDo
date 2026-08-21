import { CreateOrganization } from "@clerk/nextjs";
import { pages } from "@/config/routing/pages.route";

export default function CreateOrganizationPage() {
    return (
        <CreateOrganization
            afterCreateOrganizationUrl={pages.DASHBOARD_CLERK_PATTERN}
        />
    )
}