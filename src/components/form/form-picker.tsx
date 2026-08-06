"use client"

import { defaultImages } from "@/config/const/images"
import { unsplash } from "@/lib/unsplash"
import { cn } from "@/lib/utils"
import { Check, Loader2 } from "lucide-react"
import Image from "next/image"
import { useEffect, useState } from "react"
import { useFormStatus } from "react-dom"
import { FormErrors } from "./form-errors"

interface FormPickerProps {
    id: string
    errors?: Record<string, string[] | undefined>
}

export const FormPicker = ({
    id, errors
}: FormPickerProps) => {
    const { pending } = useFormStatus()

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [images, setImages] = useState<Array<Record<string, any>>>(defaultImages) // []
    const [isLoading, setIsLoading] = useState(true)
    const [selectedImageId, setSelectedImageId] = useState(null)

    useEffect(() => {
        const fetchImages = async () => {
            try {
                const result = await unsplash.GET("/photos/random", {
                    params: {
                        query: {
                            collections: ["317099"],
                            count: 9
                        }
                    }
                })

                if(result && result.data) {
                    // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
                    const images = (result.data as Array<Record<string, any>>)
                    setImages(defaultImages) // images
                } else {
                    console.error("Failed to get images")
                }
            } catch (err) {
                console.error(err)
                setImages([])
            } finally {
                setIsLoading(false)
            }
        }

        fetchImages()
    }, [])

    if(isLoading) {
        return (
            <div className="p-6 flex items-center justify-center">
                <Loader2 className="animate-spin h-6 w-6"/>
            </div>
        )
    }

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