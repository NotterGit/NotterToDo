"use client";

import Image from "next/image";
import Link from "next/link";
import { ChevronRight, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { images } from "@/config/const/image.const";
import { pages } from "@/config/routing/pages.route";

import { usePwaInstall } from "@/hooks/use-pwa-install";

export function Heading() {
  const { promptInstall, isStandalone } = usePwaInstall();

  return (
    <section className="grid items-center gap-8 px-4 pt-12 md:grid-cols-2">
      <div className="space-y-6 text-left">
        <h1 className="text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl md:text-6xl">
          Новый уровень построения задач. Встречайте{" "}
          <span className="bg-gradient-to-r from-logo-yellow to-logo-light-yellow bg-clip-text text-transparent">
            Notter ToDo
          </span>
        </h1>

        <p className="max-w-xl text-base text-muted-foreground sm:text-lg">
          Планируйте, синхронизируйте и работайте в команде в комфортной среде
        </p>

        <div className="flex flex-wrap items-center gap-3 pt-2">
          <Link href={pages.DASHBOARD()}>
            <Button size="lg">
              Перейти в ToDo <ChevronRight className="h-4 w-4" />
            </Button>
          </Link>

          <Button
            variant="outline"
            size="lg"
            className="gap-2"
            type="button"
            onClick={promptInstall}
            aria-label="Установить Notter ToDo"
          >
            {isStandalone ? "Установлено" : "Установить"} <Download className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="mt-6 flex justify-center md:mt-0">
        <Image
          src={images.LANDING}
          alt="Notter ToDo"
          width={550}
          height={550}
          priority
        />
      </div>
    </section>
  );
}

