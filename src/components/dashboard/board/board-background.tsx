"use client"

import { useBoardBlur } from "@/hooks/use-board-blur"
import { useEffect, useState } from "react"

interface BoardBackgroundProps {
  image: string
  children: React.ReactNode
}

export function BoardBackground({ image, children }: BoardBackgroundProps) {
  const { blur } = useBoardBlur()
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const currentBlur = isMounted ? blur : 0
  const blurPx = (currentBlur / 100) * 20

  return (
    <div className="relative h-full w-full overflow-hidden">
      <div
        className="absolute inset-0 bg-no-repeat bg-cover bg-center transition-[filter,transform] duration-200"
        style={{
          backgroundImage: `url(${image})`,
          filter: blurPx > 0 ? `blur(${blurPx}px)` : undefined,
          transform: blurPx > 0 ? "scale(1.06)" : undefined,
        }}
      />
      <div className="absolute inset-0 bg-black/15 pointer-events-none" />
      <div className="relative h-full w-full">
        {children}
      </div>
    </div>
  )
}
