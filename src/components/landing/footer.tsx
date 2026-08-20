"use client"

import Image from "next/image";
import Link from "next/link";
import { images } from "@/config/const/image.const";
import { links } from "@/config/const/links.const";
import { pages } from "@/config/routing/pages.route";

export function Footer(){
    const currentYear = new Date().getFullYear()

    return (
        <footer className="w-full mt-auto rounded-lg">
            <div className="w-full max-w-screen-xl mx-auto p-4 md:py-8 ">
                <div className="sm:flex sm:items-center sm:justify-between">
                    <Link href={pages.ROOT} className="flex items-center mb-4 sm:mb-0 space-x-3 rtl:space-x-reverse">
                        <Image src={images.LOGO} height="50" width="180" alt="Notter Logo"/>
                    </Link>
                    <ul className="flex flex-wrap items-center mb-6 text-sm font-medium sm:mb-0 text-muted-foreground">
                        <li>
                            <Link href={links.FEEDBACK} target="_blank" className="me-4 md:me-6 hover:text-foreground transition-colors duration-200">Feedback</Link>
                        </li>
                        <li>
                            <Link href={links.QUAL_ID} target="_blank" className="me-4 md:me-6 hover:text-foreground transition-colors duration-200">Qual ID</Link>
                        </li>
                        <li>
                            <Link href={links.TELEGRAM} target="_blank" className="me-4 md:me-6 hover:text-foreground transition-colors duration-200">Telegram</Link>
                        </li>
                    </ul>
                </div>
                <hr className="my-6 border-border sm:mx-auto lg:my-8" />
                <span className="block text-sm text-muted-foreground sm:text-center">© 2024-{currentYear} <Link href={links.QUALSU} target="_blank" className="hover:text-foreground transition-colors duration-200">Qualsu</Link></span>
            </div>
        </footer>
    )
}