"use client"

import { OrganizationProfile, UserProfile, useOrganization } from "@clerk/nextjs";
import { useParams } from "next/navigation";

export default function Settings() {
  const params = useParams();
  const { organization } = useOrganization();
  const orgId = params.orgId as string | undefined;
  const isPersonal = orgId ? !orgId.startsWith("org_") : !organization;

  return (
    <div className="w-full">
      {isPersonal ? (
        <UserProfile 
          routing="hash"
          appearance={{
            elements: {
              rootBox: "w-full",
              cardBox: "shadow-none w-full border border-border rounded-xl",
              card: "shadow-none w-full border border-border rounded-xl"
            }
          }}
        />
      ) : (
        <OrganizationProfile 
          routing="hash"
          appearance={{
            elements: {
              rootBox: "w-full",
              cardBox: "shadow-none w-full border border-border rounded-xl",
              card: "shadow-none w-full border border-border rounded-xl"
            }
          }}
        />
      )}
    </div>
  )
}
