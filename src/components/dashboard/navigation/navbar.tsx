import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { OrganizationSwitcher, UserButton } from "@clerk/nextjs";
import { MobileSidebar } from "../../../app/(dashboard)/_components/mobile-sidebar";
import { FormPopover } from "@/components/form/form-popover";

export function Navbar() {
    return (
        <nav className="fixed z-50 top-0 w-full h-14 border-b shadow-sm bg-white flex items-center px-4">
            <MobileSidebar/>
            <div className="flex items-center gap-x-4">
                <div className="hidden md:flex">
                    <Link href="/" className="flex items-center gap-x-2 hover:opacity-90 transition">
                        <Image src="/icon.png" alt="Notter Todo Icon" width={36} height={36} />
                    </Link>
                </div>
                <FormPopover align="start" side="bottom" sideOffset={18}>
                    <Button className="rounded-sm hidden md:block h-auto py-1.5 px-2">
                        Create
                    </Button>
                </FormPopover>
                <FormPopover>
                    <Button className="rounded-sm block md:hidden">
                        <Plus className="h-4 w-4"/>
                    </Button>
                </FormPopover>
            </div>
            <div className="ml-auto flex items-center gap-x-2">
                <OrganizationSwitcher 
                    afterCreateOrganizationUrl="/organization/:id"
                    afterSelectOrganizationUrl="/organization/:id"
                    afterLeaveOrganizationUrl="/auth/select-org"
                    appearance={{
                        elements: {
                            rootBox: {
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center"
                            }
                        }
                    }}
                />
                <UserButton
                    appearance={{
                        elements: {
                            rootBox: {
                                width: 30,
                                height: 30
                            }
                        }
                    }}
                />
            </div>
        </nav>
    )
}