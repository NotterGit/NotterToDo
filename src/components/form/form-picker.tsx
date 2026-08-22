"use client"

import { defaultImages } from "@/config/const/banner-images.const"
import { cn } from "@/lib/utils"
import { Check } from "lucide-react"
import Image from "next/image"
import { useState } from "react"
import { useFormStatus } from "react-dom"
import { FormErrors } from "./form-errors"
import type { FormPickerProps } from "@/config/types/components.types"

export const FormPicker = ({
    id, errors, defaultValue
}: FormPickerProps) => {
    const { pending } = useFormStatus()

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [images] = useState<Array<Record<string, any>>>(defaultImages)
    const [selectedImageId, setSelectedImageId] = useState<string | null>(defaultValue || null)

    return (
        <div className="relative">
            <div className="grid grid-cols-3 gap-2 mb-2">
                {images.map((image) => (
                    <div
                        key={image.id}
                        className={cn(
                            "cursor-pointer relative aspect-video group hover:opacity-75 transition bg-muted",
                            pending && "opacity-50 hover:opacity-50 cursor-auto"
                        )}
                        onClick={() => {
                            if(pending) return
                            setSelectedImageId(image.id)
                        }}
                    >
                        <input 
                            type="radio"
                            id={id}
                            name={id}
                            className="hidden"
                            checked={selectedImageId === image.id}
                            onChange={() => {}}
                            disabled={pending} 
                            value={`${image.id}|${image.urls.thumb}|${image.urls.full}|${image.links.html}|${image.user.name}`}
                        />
                        <Image
                            fill
                            src={image.urls.thumb}
                            alt="unsplash image"
                            className="object-cover rounded-sm"
                        />
                        {selectedImageId === image.id && (
                            <div className="absolute inset-y-0 h-full w-full bg-black/30 flex items-center justify-center">
                                <Check className="h-4 w-4 text-white" />
                            </div>
                        )}
                        <span
                            className="opacity-0 group-hover:opacity-100 absolute bottom-0 w-full text-[10px] truncate text-neutral-200 p-1 bg-black/5"
                        >   
                            {image.user.name}
                        </span>
                    </div>
                ))}
            </div>
            <FormErrors
                id="image"
                errors={errors}
            />
        </div>
    )
}