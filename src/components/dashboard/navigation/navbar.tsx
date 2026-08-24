"use client"

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { OrganizationSwitcher, UserButton, useAuth } from "@clerk/nextjs";
import { MobileSidebar } from "./mobile-sidebar";
import { FormPopover } from "@/components/form/form-popover";
import { images } from "@/config/const/image.const";
import { pages } from "@/config/routing/pages.route";
import { ModeToggle } from "@/components/ui/mode-toggle";
import { usePathname } from "next/navigation";

export function Navbar() {
    const path = usePathname()
    const { userId, orgId } = useAuth()

    const isBoardPage = path?.startsWith("/board");
    const logoHref = pages.DASHBOARD(orgId || userId || undefined);

    return (
        <nav className="fixed z-50 top-0 w-full h-14 border-b border-white/50 bg-white/80 backdrop-blur-xl shadow-sm dark:border-white/10 dark:bg-zinc-950/80 flex items-center px-4">
            <div className="flex items-center gap-x-2 md:gap-x-4">
                <MobileSidebar/>
                <Link href={logoHref} className="hidden md:flex items-center gap-x-2 hover:opacity-90 transition">
                    <Image src={images.ICON} alt="Notter Todo Icon" width={36} height={36} />
                </Link>
                {!isBoardPage && (
                    <>
                        <FormPopover align="start" side="bottom" sideOffset={18}>
                            <Button className="rounded-xl hidden md:flex h-auto py-1.5 px-3 flex-row font-medium shadow-sm">
                                <Plus className="h-4 w-4 mr-1"/> Создать
                            </Button>
                        </FormPopover>
                        <FormPopover>
                            <Button className="rounded-xl flex md:hidden h-8 w-8 p-0 shadow-sm">
                                <Plus className="h-4 w-4"/>
                            </Button>
                        </FormPopover>
                    </>
                )}
            </div>
            <div className="ml-auto flex items-center gap-x-3">
                <div className="hidden md:block">
                    <OrganizationSwitcher 
                        hidePersonal={false}
                        afterCreateOrganizationUrl={pages.DASHBOARD_CLERK_PATTERN}
                        afterSelectOrganizationUrl={pages.DASHBOARD_CLERK_PATTERN}
                        afterSelectPersonalUrl={pages.DASHBOARD_CLERK_PATTERN}
                        afterLeaveOrganizationUrl={pages.DASHBOARD()}
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
                </div>
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
                <ModeToggle/>
            </div>
        </nav>
    )
}