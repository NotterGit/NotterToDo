import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { images } from "@/config/const/image.const";
import { pages } from "@/config/routing/pages.route";

export default function Landing() {
    return (
        <div className="flex flex-col items-center justify-center text-center">
            <div className="flex flex-col items-center justify-center gap-4">
                <Image src={images.LOGO} alt="Notter Todo Logo" width={300} height={100} priority />

                <span className="text-muted-foreground font-medium text-lg">Скоро...</span> 

                <Button>
                    <Link href={pages.DASHBOARD}>
                        Начать
                    </Link>
                </Button>
            </div>
        </div>
    )
}