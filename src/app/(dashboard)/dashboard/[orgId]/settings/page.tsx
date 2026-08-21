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
              rootBox: "w-full shadow-none",
              cardBox: "shadow-none w-full border border-border rounded-xl",
              card: "shadow-none w-full border border-border rounded-xl",
              scrollBox: "shadow-none",
              pageScrollBox: "shadow-none",
              navbar: "shadow-none"
            }
          }}
        />
      ) : (
        <OrganizationProfile 
          routing="hash"
          appearance={{
            elements: {
              rootBox: "w-full shadow-none",
              cardBox: "shadow-none w-full border border-border rounded-xl",
              card: "shadow-none w-full border border-border rounded-xl",
              scrollBox: "shadow-none",
              pageScrollBox: "shadow-none",
              navbar: "shadow-none"
            }
          }}
        />
      )}
    </div>
  )
}
