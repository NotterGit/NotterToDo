"use client"

import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"

import { Navbar } from "@/components/landing/navbar"
import { Button } from "@/components/ui/button"
import { pages } from "@/config/routing/pages.route"
import { images } from "@/config/const/image.const"

export default function NotFoundClient() {
  const router = useRouter()

  return (
    <div className="relative isolate flex min-h-screen flex-col overflow-hidden bg-background text-foreground">
      <Navbar />

      <div className="pointer-events-none absolute -left-20 -top-20 -z-10 h-72 w-72 rounded-full bg-logo-yellow/20 blur-3xl dark:bg-logo-light-yellow/20" />
      <div className="pointer-events-none absolute -bottom-24 -right-20 -z-10 h-80 w-80 rounded-full bg-logo-cyan/15 blur-3xl" />

      <main className="flex flex-1 items-center justify-center p-6 pt-16">
        <div className="flex flex-col items-center gap-8 md:flex-row">
          <div className="flex-shrink-0">
            <Image
              src={images.ERROR}
              width={140}
              height={200}
              alt="Notter"
              className="rounded-lg object-cover"
            />
          </div>

          <div className="flex-1 text-center md:text-left">
            <h1 className="text-6xl font-extrabold">404</h1>
            <p className="mt-2 text-2xl font-semibold">Страница не найдена</p>
            <p className="mt-4 max-w-80">Кажется, вы заблудились. Возможно, страница была удалена или переехала</p>

            <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
              <Button>
                <Link href={pages.ROOT}>На главную</Link>
              </Button>

              <Button variant="ghost" onClick={() => router.back()}>
                Назад
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
