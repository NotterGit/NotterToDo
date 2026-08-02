import { OrganizationProfile } from "@clerk/nextjs";

export default function Settings() {
  return (
    <div className="w-full">
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
    </div>
  )
}
