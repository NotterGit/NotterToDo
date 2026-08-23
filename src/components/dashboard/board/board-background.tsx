"use client"

import { useBoardBlur } from "@/hooks/use-board-blur"
import { useBoardPreview } from "@/hooks/use-board-preview"
import { useEffect, useState } from "react"

interface BoardBackgroundProps {
  image: string
  children: React.ReactNode
}

export function BoardBackground({ image, children }: BoardBackgroundProps) {
  const { blur } = useBoardBlur()
  const { previewImage, resetPreviewImage } = useBoardPreview()
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
    return () => {
      resetPreviewImage()
    }
  }, [resetPreviewImage])

  const currentBlur = isMounted ? blur : 0
  const blurPx = (currentBlur / 100) * 20
  const displayImage = (isMounted && previewImage) ? previewImage : image

  return (
    <div className="relative h-full w-full overflow-hidden">
      <div
        className="absolute inset-0 bg-no-repeat bg-cover bg-center transition-[filter,transform,background-image] duration-300"
        style={{
          backgroundImage: `url(${displayImage})`,
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
