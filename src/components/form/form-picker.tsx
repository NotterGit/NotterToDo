"use client"

import { bgImages, defaultBgImage } from "@/config/const/banner-images.const"
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
    const [selectedImage, setSelectedImage] = useState<string>(defaultValue || defaultBgImage)

    return (
        <div className="relative">
            <div className="grid grid-cols-3 gap-2 mb-2">
                {bgImages.map((image) => (
                    <div
                        key={image}
                        className={cn(
                            "cursor-pointer relative aspect-video group hover:opacity-75 transition bg-muted rounded-sm overflow-hidden",
                            pending && "opacity-50 hover:opacity-50 cursor-auto"
                        )}
                        onClick={() => {
                            if (pending) return
                            setSelectedImage(image)
                        }}
                    >
                        <input 
                            type="radio"
                            id={id}
                            name={id}
                            className="hidden"
                            checked={selectedImage === image}
                            onChange={() => {}}
                            disabled={pending} 
                            value={image}
                        />
                        <Image
                            fill
                            src={image}
                            alt="Фон доски"
                            className="object-cover"
                        />
                        {selectedImage === image && (
                            <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                                <Check className="h-4 w-4 text-white" />
                            </div>
                        )}
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