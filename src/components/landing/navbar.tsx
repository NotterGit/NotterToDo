import { Button } from "@/components/ui/button";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import { images } from "@/config/const/image.const";
import { pages } from "@/config/routing/pages.route";
import { ModeToggle } from "../ui/mode-toggle";

export function Navbar() {
  return (
    <nav className="fixed top-0 w-full h-14 px-4 sm:px-6 border-b border-border bg-background shadow-sm flex items-center z-50">
        <div className="md:max-w-screen-2xl mx-auto flex items-center w-full justify-between">
            <Link href={pages.ROOT} className="flex items-center gap-x-2 hover:opacity-90 transition">
                <Image src={images.ICON} alt="Notter Todo Icon" width={36} height={36} />
            </Link>
            <div className="flex items-center gap-x-3">
                <SignedIn>
                    <Link href={pages.DASHBOARD()}>
                        <Button>Перейти</Button>
                    </Link>
                    <UserButton />
                </SignedIn>

                <SignedOut>
                    <SignInButton>
                        <Button variant="ghost">Войти</Button>
                    </SignInButton>
                </SignedOut>

                <ModeToggle/>
            </div>
        </div>
    </nav>
  )
}
