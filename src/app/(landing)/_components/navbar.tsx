import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

export function Navbar() {
  return (
    <nav className="fixed top-0 w-full h-14 px-4 border-b bg-white shadow-sm flex items-center z-50">
        <div className="md:max-w-screen-2xl mx-auto flex items-center w-full justify-between">
            <Image src="/icon.png" alt="Notter Todo Icon" width={40} height={40} />
            <div>
                <Button variant="ghost">
                    <Link href="/auth/sign-in">
                        Login
                    </Link>
                </Button>
                <Button>
                    <Link href="/dashboard">
                        Dashboard
                    </Link>
                </Button>
            </div>
        </div>
    </nav>
  )
}
