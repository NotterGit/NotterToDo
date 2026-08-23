"use client";

import { useState } from "react";
import { Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { images } from "@/config/const/image.const";
import { PremiumCard } from "./premium-card";

export function Premium() {
  const [isTeam, setIsTeam] = useState(false);

  const toggleAccountType = (type: "personal" | "team") => {
    setIsTeam(type === "team");
  };

  const amberPrice = isTeam ? 149 : 29;
  const diamondPrice = isTeam ? 299 : 99;
  const freePrice = 0;

  const boardsLimit = {
    free: "5 досок",
    amber: isTeam ? "50 досок" : "25 досок",
    diamond: "Неограниченно",
  };

  return (
    <section className="space-y-8 px-4 ">
      <div className="mx-auto max-w-2xl text-center space-y-3">
        <h2 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
          <span className="bg-gradient-to-r from-logo-yellow to-logo-light-yellow bg-clip-text text-transparent">
            Notter{" "}
          </span>
          <span className="text-logo-cyan">Gem</span>
        </h2>

        <p className="text-muted-foreground text-sm sm:text-base">
          Подписка, улучшающая и делающая работу с задачами еще приятнее
        </p>

        {/* Переключатель тарифов Личная / Командная */}
        <div className="inline-flex items-center justify-center rounded-xl border border-border/60 bg-muted/50 p-1 backdrop-blur-sm">
          <Button
            size="sm"
            onClick={() => toggleAccountType("personal")}
            variant={!isTeam ? "default" : "ghost"}
            className="rounded-lg text-sm transition-all"
          >
            Личная
          </Button>
          <Button
            size="sm"
            onClick={() => toggleAccountType("team")}
            variant={isTeam ? "default" : "ghost"}
            className="rounded-lg text-sm transition-all"
          >
            Командная
          </Button>
        </div>
      </div>

      {/* Сетка тарифов */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 text-left">
        <PremiumCard
          title="Free"
          price={freePrice}
          className="border-gray-300 dark:border-zinc-700"
          features={[
            `До ${boardsLimit.free}`,
            "Базовый журнал аудита действий",
            "Неограниченное число задач и списков",
          ]}
          btn={false}
        />

        <PremiumCard
          title="Amber"
          price={amberPrice}
          isPopular
          icon={images.BADGE.AMBER}
          className="border-yellow-300 dark:border-yellow-300/40"
          features={[
            `До ${boardsLimit.amber}`,
            "Уникальный значок Amber в профиле",
            "Расширенный журнал аудита",
            "Кастомные фоновые изображения",
          ]}
        />

        <PremiumCard
          title="Diamond"
          price={diamondPrice}
          icon={images.BADGE.DIAMOND}
          className="border-cyan-300 dark:border-cyan-300/40"
          features={[
            "Все преимущества тарифа Amber",
            `До ${boardsLimit.diamond}`,
            "Уникальный значок Diamond в профиле",
            "Экспорт и импорт досок",
            "Экспорт журнала аудита",
          ]}
        />
      </div>

      {/* Таблица сравнения лимитов */}
      <div className="mt-10 overflow-hidden rounded-2xl border border-border/60 bg-card/60 dark:bg-zinc-900/40 p-4 backdrop-blur-md">
        <Table>
          <TableCaption>Сравнение возможностей тарифов Notter Gem</TableCaption>
          <TableHeader>
            <TableRow className="border-border/60">
              <TableHead className="w-[40%] font-bold text-foreground">Характеристика</TableHead>
              <TableHead className="font-semibold text-foreground">Free</TableHead>
              <TableHead className="font-semibold text-yellow-400">Amber</TableHead>
              <TableHead className="font-semibold text-cyan-500">Diamond</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="text-left">
            <TableRow className="border-border/40">
              <TableCell className="font-medium">Количество досок</TableCell>
              <TableCell>{boardsLimit.free}</TableCell>
              <TableCell className="font-medium text-yellow-400">{boardsLimit.amber}</TableCell>
              <TableCell className="font-medium text-cyan-500">{boardsLimit.diamond}</TableCell>
            </TableRow>
            <TableRow className="border-border/40">
              <TableCell className="font-medium">Значок в профиле</TableCell>
              <TableCell><X className="h-4 w-4 text-muted-foreground" /></TableCell>
              <TableCell><Check className="h-4 w-4 text-yellow-400" /></TableCell>
              <TableCell><Check className="h-4 w-4 text-cyan-500" /></TableCell>
            </TableRow>
            <TableRow className="border-border/40">
              <TableCell className="font-medium">Расширенный аудит активности</TableCell>
              <TableCell><X className="h-4 w-4 text-muted-foreground" /></TableCell>
              <TableCell><Check className="h-4 w-4 text-yellow-400" /></TableCell>
              <TableCell><Check className="h-4 w-4 text-cyan-500" /></TableCell>
            </TableRow>
            <TableRow className="border-border/40">
              <TableCell className="font-medium">Кастомные фоны досок</TableCell>
              <TableCell><X className="h-4 w-4 text-muted-foreground" /></TableCell>
              <TableCell><Check className="h-4 w-4 text-yellow-400" /></TableCell>
              <TableCell><Check className="h-4 w-4 text-cyan-500" /></TableCell>
            </TableRow>
            <TableRow className="border-border/40">
              <TableCell className="font-medium">Экспорт и импорт досок</TableCell>
              <TableCell><X className="h-4 w-4 text-muted-foreground" /></TableCell>
              <TableCell><X className="h-4 w-4 text-muted-foreground" /></TableCell>
              <TableCell><Check className="h-4 w-4 text-cyan-500" /></TableCell>
            </TableRow>
            <TableRow className="border-border/40">
              <TableCell className="font-medium">Экспорт журнала</TableCell>
              <TableCell><X className="h-4 w-4 text-muted-foreground" /></TableCell>
              <TableCell><X className="h-4 w-4 text-muted-foreground" /></TableCell>
              <TableCell><Check className="h-4 w-4 text-cyan-500" /></TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </section>
  );
}
