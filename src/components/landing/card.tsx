import React from "react";
import Image from "next/image";
import type { FeatureCardProps } from "@/config/types/landing.types";

export function Card({
  name,
  title,
  description,
  icon: Icon,
  img,
}: FeatureCardProps) {
  const cardTitle = name || title;

  return (
    <div className="group relative w-full max-w-[1200px] mx-auto overflow-hidden rounded-2xl border border-border/60 bg-card/70 dark:bg-zinc-900/60 p-6 backdrop-blur-md transition-all duration-300 hover:-translate-y-0.5 hover:border-yellow-400/40 dark:border-white/10 dark:hover:border-yellow-400/30">
      <div className="pointer-events-none absolute -right-12 -top-12 h-36 w-36 rounded-full bg-gradient-to-br from-logo-yellow/20 to-logo-light-yellow/10 opacity-0 blur-2xl transition-opacity duration-300 group-hover:opacity-100" />

      <section className="flex flex-col items-center md:flex-row gap-6">
        <div className="shrink-0">
          <div className="flex h-20 w-20 md:h-24 md:w-24 items-center justify-center transition-transform duration-300 group-hover:scale-105">
            {Icon ? (
              <Icon className="h-9 w-9 md:h-11 md:w-11 text-yellow-500 transition-transform duration-300 group-hover:scale-110" />
            ) : img ? (
              <Image
                src={img}
                width={48}
                height={48}
                alt={cardTitle || ""}
                className="h-20 w-20 object-contain"
              />
            ) : null}
          </div>
        </div>

        <div className="text-center md:text-left">
          <h3 className="mb-2 text-2xl font-bold tracking-tight text-foreground transition-colors group-hover:text-foreground md:text-3xl">
            {cardTitle}
          </h3>
          <p className="max-w-3xl text-base leading-relaxed text-muted-foreground">
            {description}
          </p>
        </div>
      </section>
    </div>
  );
}

export default Card;


