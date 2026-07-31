import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

export default function Landing() {
    return (
        <div className="flex flex-col items-center justify-center text-center">
            <div className="flex flex-col items-center justify-center gap-4">
                <Image src="/logo.png" alt="Notter Todo Logo" width={300} height={100} priority />

                <span className="text-muted-foreground font-medium text-lg">Coming soon...</span> 

                <Button>
                    <Link href="/dashboard">
                        Get started
                    </Link>
                </Button>
            </div>
        </div>
    )
}