"use client"

import { defaultBgImage } from "@/config/const/banner-images.const"
import { API } from "@/config/routing/api.route"
import type { BgCollection, FormPickerProps } from "@/config/types/components.types"
import { fetcher } from "@/lib/fetcher"
import { cn } from "@/lib/utils"
import { useQuery } from "@tanstack/react-query"
import { Check } from "lucide-react"
import Image from "next/image"
import { useEffect, useState, useRef } from "react"
import { useFormStatus } from "react-dom"
import { FormErrors } from "./form-errors"
import { Skeleton } from "@/components/ui/skeleton"

export const FormPicker = ({
    id, errors, defaultValue, onChange
}: FormPickerProps) => {
    const { pending } = useFormStatus()
    const [selectedImage, setSelectedImage] = useState<string>(defaultValue || defaultBgImage)
    const [activeFolder, setActiveFolder] = useState<string>("")
    const initializedRef = useRef(false)

    const { data: collections, isLoading } = useQuery<BgCollection[]>({
        queryKey: ["board-backgrounds"],
        queryFn: () => fetcher(API.BACKGROUNDS),
    })

    useEffect(() => {
        if (!collections || collections.length === 0 || initializedRef.current) return

        const initialTarget = defaultValue || defaultBgImage
        const foundCollection = collections.find((col) =>
            col.images.some((img) => img === initialTarget)
        )

        if (foundCollection) {
            setActiveFolder(foundCollection.folder)
            setSelectedImage(initialTarget)
        } else {
            setActiveFolder(collections[0].folder)
            if (!defaultValue && collections[0].images.length > 0) {
                setSelectedImage(collections[0].images[0])
            }
        }

        initializedRef.current = true
    }, [collections, defaultValue])

    useEffect(() => {
        if (defaultValue) {
            setSelectedImage(defaultValue)
            if (collections && collections.length > 0) {
                const found = collections.find((col) =>
                    col.images.some((img) => img === defaultValue)
                )
                if (found) {
                    setActiveFolder(found.folder)
                }
            }
        }
    }, [defaultValue, collections])

    const handleSelectImage = (image: string) => {
        if (pending) return
        setSelectedImage(image)
        onChange?.(image)
    }

    const activeCollection =
        collections?.find((col) => col.folder === activeFolder) || collections?.[0]

    if(isLoading){
        return (
            <div className="space-y-2">
                <div className="flex gap-1.5 pb-1">
                    <Skeleton className="h-6 w-20 rounded-full" />
                    <Skeleton className="h-6 w-20 rounded-full" />
                    <Skeleton className="h-6 w-20 rounded-full" />
                </div>
                <div className="grid grid-cols-3 gap-2">
                    {Array.from({ length: 6 }).map((_, i) => (
                        <Skeleton key={i} className="aspect-video rounded-md" />
                    ))}
                </div>
            </div>
        )
    }

    return (
        <div className="relative space-y-2.5">
            {collections && collections.length > 0 ? (
                <>
                    <div className="flex items-center gap-1.5 overflow-x-auto pb-1 -mx-0.5 px-0.5 scrollbar-none">
                        {collections.map((col) => {
                            const isActive = (activeFolder || collections[0].folder) === col.folder
                            return (
                                <button
                                    key={col.folder}
                                    type="button"
                                    disabled={pending}
                                    onClick={() => setActiveFolder(col.folder)}
                                    className={cn(
                                        "px-2.5 py-1 text-xs font-medium rounded-full transition-all whitespace-nowrap shrink-0",
                                        isActive
                                            ? "bg-primary text-primary-foreground shadow-sm"
                                            : "bg-muted/80 text-muted-foreground hover:bg-muted hover:text-foreground"
                                    )}
                                >
                                    {col.name}
                                </button>
                            )
                        })}
                    </div>

                    <div className="grid grid-cols-3 gap-2 max-h-52 overflow-y-auto pr-0.5">
                        {activeCollection?.images.map((image) => {
                            const isSelected = selectedImage === image
                            return (
                                <button
                                    key={image}
                                    type="button"
                                    disabled={pending}
                                    onClick={() => handleSelectImage(image)}
                                    className={cn(
                                        "cursor-pointer relative aspect-video group hover:opacity-85 transition bg-muted rounded-md overflow-hidden border border-border/40 text-left p-0 focus:outline-none",
                                        pending && "opacity-50 hover:opacity-50 cursor-auto"
                                    )}
                                >
                                    <Image
                                        fill
                                        src={image}
                                        alt="Фон доски"
                                        className="object-cover"
                                        sizes="(max-width: 768px) 100px, 150px"
                                    />
                                    {isSelected && (
                                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                                            <Check className="h-4 w-4 text-white" />
                                        </div>
                                    )}
                                </button>
                            )
                        })}
                    </div>
                </>
            ) : (
                <div className="text-xs text-muted-foreground text-center py-4">
                    Нет доступных фонов
                </div>
            )}

            <input
                type="hidden"
                id={id}
                name={id}
                value={selectedImage}
                disabled={pending}
            />

            <FormErrors
                id="image"
                errors={errors}
            />
        </div>
    )
}