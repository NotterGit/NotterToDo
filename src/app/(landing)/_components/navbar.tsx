import { Button } from "@/components/ui/button";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";

export function Navbar() {
  return (
    <nav className="fixed top-0 w-full h-14 px-4 sm:px-6 border-b bg-white shadow-sm flex items-center z-50">
        <div className="md:max-w-screen-2xl mx-auto flex items-center w-full justify-between">
            <Link href="/" className="flex items-center gap-x-2 hover:opacity-90 transition">
                <Image src="/icon.png" alt="Notter Todo Icon" width={36} height={36} />
                <span className="font-bold text-lg text-slate-800 hidden sm:inline-block">Notter ToDo</span>
            </Link>
            <div className="flex items-center gap-x-3">
                <SignedIn>
                    <Link href="/dashboard">
                        <Button size="sm">Перейти</Button>
                    </Link>
                    <UserButton />
                </SignedIn>

                <SignedOut>
                    <SignInButton mode="modal">
                        <Button variant="ghost" size="sm">Войти</Button>
                    </SignInButton>
                </SignedOut>
            </div>
        </div>
    </nav>
  )
}
