"use client"

import { defaultBgImage } from "@/config/const/banner-images.const"
import { API } from "@/config/routing/api.route"
import { hasCustomBackgrounds, MAX_UPLOAD_SIZE_MB } from "@/config/const/limits.const"
import type { BgCollection, FormPickerProps } from "@/config/types/components.types"
import { fetcher } from "@/lib/fetcher"
import { cn } from "@/lib/utils"
import { useQuery } from "@tanstack/react-query"
import { useAuth } from "@clerk/nextjs"
import { useAccountProfile } from "@/hooks/use-account-profile"
import { uploadFileToS3 } from "@/api/s3"
import { Check, Image as ImageIcon, Loader2, Lock, Sparkles, Upload, X } from "lucide-react"
import Image from "next/image"
import { useEffect, useState, useRef, useCallback } from "react"
import { useFormStatus } from "react-dom"
import { FormErrors } from "./form-errors"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import { Hint } from "@/components/ui/hint"

export const FormPicker = ({
    id, errors, defaultValue, onChange
}: FormPickerProps) => {
    const { pending } = useFormStatus()
    const { userId, orgId } = useAuth()
    const targetOrgId = orgId || userId
    const isOrg = Boolean(orgId)
    const { data: profile } = useAccountProfile(targetOrgId, isOrg)

    const canUploadCustom = hasCustomBackgrounds(profile?.premium)
    const isCustomUrl = (url?: string) => Boolean(url && !url.startsWith("/bg/"))

    const [mainTab, setMainTab] = useState<"presets" | "custom">(
        canUploadCustom && isCustomUrl(defaultValue) ? "custom" : "presets"
    )
    const [selectedImage, setSelectedImage] = useState<string>(defaultValue || defaultBgImage)
    const [customUploadedUrl, setCustomUploadedUrl] = useState<string | null>(
        canUploadCustom && isCustomUrl(defaultValue) ? defaultValue! : null
    )
    const [isUploading, setIsUploading] = useState(false)
    const [isDragging, setIsDragging] = useState(false)
    const [activeFolder, setActiveFolder] = useState<string>("")
    const fileInputRef = useRef<HTMLInputElement>(null)
    const initializedRef = useRef(false)

    const { data: collections, isLoading } = useQuery<BgCollection[]>({
        queryKey: ["board-backgrounds"],
        queryFn: () => fetcher(API.BACKGROUNDS),
    })

    useEffect(() => {
        if (!collections || collections.length === 0 || initializedRef.current) return

        const initialTarget = defaultValue || defaultBgImage
        if (canUploadCustom && isCustomUrl(initialTarget)) {
            setMainTab("custom")
            setCustomUploadedUrl(initialTarget)
            setSelectedImage(initialTarget)
            setActiveFolder(collections[0].folder)
        } else {
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
        }

        initializedRef.current = true
    }, [collections, defaultValue, canUploadCustom])

    useEffect(() => {
        if (defaultValue) {
            setSelectedImage(defaultValue)
            if (canUploadCustom && isCustomUrl(defaultValue)) {
                setCustomUploadedUrl(defaultValue)
                setMainTab("custom")
            } else if (collections && collections.length > 0) {
                const found = collections.find((col) =>
                    col.images.some((img) => img === defaultValue)
                )
                if (found) {
                    setActiveFolder(found.folder)
                }
            }
        }
    }, [defaultValue, collections, canUploadCustom])

    const handleSelectImage = useCallback((image: string) => {
        if (pending || isUploading) return
        setSelectedImage(image)
        onChange?.(image)
    }, [pending, isUploading, onChange])

    const handleFileUpload = useCallback(async (file: File) => {
        if (!canUploadCustom || isUploading || pending) return

        try {
            setIsUploading(true)
            const result = await uploadFileToS3(file)
            if (result?.url) {
                setCustomUploadedUrl(result.url)
                handleSelectImage(result.url)
            }
        } finally {
            setIsUploading(false)
            if (fileInputRef.current) {
                fileInputRef.current.value = ""
            }
        }
    }, [canUploadCustom, isUploading, pending, handleSelectImage])

    const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            handleFileUpload(file)
        }
    }

    const onDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault()
        e.stopPropagation()
        if (!isDragging) setIsDragging(true)
    }

    const onDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault()
        e.stopPropagation()
        setIsDragging(false)
    }

    const onDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault()
        e.stopPropagation()
        setIsDragging(false)
        const file = e.dataTransfer.files?.[0]
        if (file) {
            handleFileUpload(file)
        }
    }

    const handleRemoveCustom = () => {
        setCustomUploadedUrl(null)
        const fallback = collections?.[0]?.images?.[0] || defaultBgImage
        handleSelectImage(fallback)
        setMainTab("presets")
    }

    const activeCollection =
        collections?.find((col) => col.folder === activeFolder) || collections?.[0]

    if (isLoading) {
        return (
            <div className="space-y-2">
                <div className="flex gap-1.5 pb-1">
                    <Skeleton className="h-7 w-24 rounded-lg" />
                    <Skeleton className="h-7 w-24 rounded-lg" />
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
            <div className="grid grid-cols-2 p-1 bg-muted/60 dark:bg-zinc-900/60 rounded-xl border border-border/40 gap-1 text-xs">
                <button
                    type="button"
                    disabled={pending || isUploading}
                    onClick={() => setMainTab("presets")}
                    className={cn(
                        "flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-lg font-medium transition-all",
                        mainTab === "presets" || !canUploadCustom
                            ? "bg-background text-foreground shadow-sm"
                            : "text-muted-foreground hover:text-foreground"
                    )}
                >
                    <ImageIcon className="h-3.5 w-3.5" />
                    Коллекции
                </button>

                {!canUploadCustom ? (
                    <Hint description="Доступно только с подпиской Notter Gem (Amber и Diamond)">
                        <div
                            className="w-full flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-lg font-medium text-muted-foreground/50 cursor-not-allowed select-none opacity-60"
                        >
                            <Lock className="h-3.5 w-3.5" />
                            Свой фон
                        </div>
                    </Hint>
                ) : (
                    <button
                        type="button"
                        disabled={pending || isUploading}
                        onClick={() => setMainTab("custom")}
                        className={cn(
                            "w-full flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-lg font-medium transition-all",
                            mainTab === "custom"
                                ? "bg-background text-foreground shadow-sm"
                                : "text-muted-foreground hover:text-foreground"
                        )}
                    >
                        <Sparkles className="h-3.5 w-3.5 text-amber-500" />
                        Свой фон
                    </button>
                )}
            </div>

            {mainTab === "presets" || !canUploadCustom ? (
                collections && collections.length > 0 ? (
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
                )
            ) : (
                <div className="space-y-3">
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/png,image/jpeg,image/webp,image/gif"
                        className="hidden"
                        disabled={pending || isUploading}
                        onChange={onFileChange}
                    />

                    {customUploadedUrl ? (
                        <div className="space-y-2">
                            <div className="relative aspect-video rounded-xl overflow-hidden border-2 border-primary shadow-sm group">
                                <Image
                                    fill
                                    src={customUploadedUrl}
                                    alt="Загруженный фон"
                                    className="object-cover"
                                    sizes="300px"
                                />
                                <div className="absolute inset-0 bg-black/35 flex items-center justify-center">
                                    <div className="flex items-center gap-1.5 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-full text-white text-xs font-medium">
                                        <Check className="h-3.5 w-3.5 text-emerald-400" />
                                        Выбран свой фон
                                    </div>
                                </div>
                                <button
                                    type="button"
                                    onClick={handleRemoveCustom}
                                    disabled={pending || isUploading}
                                    className="absolute top-1.5 right-1.5 p-1 rounded-full bg-black/60 hover:bg-rose-600 text-white transition-colors"
                                    title="Удалить фон"
                                >
                                    <X className="h-3.5 w-3.5" />
                                </button>
                            </div>

                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                disabled={pending || isUploading}
                                onClick={() => fileInputRef.current?.click()}
                                className="w-full text-xs h-8 rounded-lg gap-1.5"
                            >
                                <Upload className="h-3.5 w-3.5" />
                                Загрузить другое фото
                            </Button>
                        </div>
                    ) : (
                        <div
                            onDragOver={onDragOver}
                            onDragLeave={onDragLeave}
                            onDrop={onDrop}
                            onClick={() => !isUploading && fileInputRef.current?.click()}
                            className={cn(
                                "flex flex-col items-center justify-center p-5 rounded-xl border-2 border-dashed transition-all cursor-pointer text-center",
                                isDragging
                                    ? "border-primary bg-primary/5 scale-[0.99]"
                                    : "border-border hover:border-primary/60 hover:bg-muted/40",
                                isUploading && "pointer-events-none opacity-70"
                            )}
                        >
                            {isUploading ? (
                                <div className="flex flex-col items-center gap-2 py-2">
                                    <Loader2 className="h-6 w-6 animate-spin text-primary" />
                                    <p className="text-xs font-medium text-foreground">
                                        Загрузка...
                                    </p>
                                </div>
                            ) : (
                                <>
                                    <div className="p-2.5 rounded-full bg-primary/10 text-primary mb-2">
                                        <Upload className="h-5 w-5" />
                                    </div>
                                    <p className="text-xs font-medium text-foreground">
                                        Нажмите или перетащите фото
                                    </p>
                                    <p className="text-[11px] text-muted-foreground mt-0.5">
                                        PNG, JPG, WebP, GIF до {MAX_UPLOAD_SIZE_MB} МБ
                                    </p>
                                </>
                            )}
                        </div>
                    )}
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