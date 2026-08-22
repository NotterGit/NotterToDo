"use client"

import { updateCard } from "@/actions/update-card";
import { FormSubmit } from "@/components/form/form-button";
import { FormTextarea } from "@/components/form/form-textarea";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useAction } from "@/hooks/use-action";
import { useQueryClient } from "@tanstack/react-query";
import { AlignLeft } from "lucide-react";
import { useParams } from "next/navigation";
import { ElementRef, useRef, useState } from "react";
import toast from "react-hot-toast";
import { useEventListener, useOnClickOutside } from "usehooks-ts";
import type { DescriptionProps } from "@/config/types/modals.types";

export function Description({
    data
}: DescriptionProps) {
    const params = useParams()
    const queryClient = useQueryClient()

    const [isEditing, setIsEditing] = useState(false)

    const formRef = useRef<ElementRef<"form">>(null)
    const textareaRef = useRef<ElementRef<"textarea">>(null)

    const enableEditing = () => {
        setIsEditing(true)
        setTimeout(() => {
            textareaRef.current?.focus()
        })
    }

    const disableEditing = () => {
        setIsEditing(false)
    }

    const onKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Escape") {
        disableEditing()
        }
    }

    useEventListener("keydown", onKeyDown)
    useOnClickOutside(formRef as React.RefObject<HTMLElement>, disableEditing)

    const { execute } = useAction(updateCard, {
        onSuccess: (data) => {
            queryClient.invalidateQueries({
                queryKey: ["card", data.id]
            })
            queryClient.invalidateQueries({
                queryKey: ["card-logs", data.id]
            })
            disableEditing()
        }
    })

    const onSubmit = (formData: FormData) => {
        const description = formData.get("description") as string
        const boardId = params.boardId as string

        toast.promise(execute({ 
            id: data.id, description, boardId 
        }), {
            loading: "Обновление карточки...",
            success: (data) => `Карточка «${data.title}» обновлена`,
            error: (err) => err
        })
    }

    return (
        <div className="flex items-start gap-x-3 w-full">
            <AlignLeft className="h-5 w-5 mt-0.5 text-neutral-700 dark:text-neutral-300 mb-2"/>
            <div className="w-full">
                <p className="font-semibold text-neutral-700 dark:text-neutral-200 mb-2">
                    Описание
                </p>
                {isEditing ? (
                    <form 
                        action={onSubmit}
                        ref={formRef}
                        className="space-y-2"
                    >
                        <FormTextarea 
                            id="description"
                            className="w-full mt-2"
                            placeholder="Добавьте более подробное описание"
                            defaultValue={data.description || undefined}
                            onClick={() => {}}
                            ref={textareaRef}
                        />
                        <div className="flex items-center gap-x-2">
                            <FormSubmit>
                                Сохранить
                            </FormSubmit>
                            <Button 
                                type="button"
                                onClick={disableEditing}
                                variant="ghost"
                            >
                                Отмена
                            </Button>
                        </div>
                    </form>
                ) : (
                    <div
                        onClick={enableEditing}
                        role="button"
                        className="min-h-[78px] bg-neutral-200 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 text-sm font-medium py-3 px-3.5 rounded-md"
                    >
                        {data.description || (<span className="text-primary/50">Добавить более подробное описание...</span>)}
                    </div>
                )}
            </div>
        </div>
    )
}

Description.Skeleton = function DescriptionSkeleton() {
    return (
        <div className="flex items-start gap-x-3 w-full">
            <Skeleton className="h-6 w-6" />
            <div className="w-full">
                <Skeleton className="w-24 h-6 mb-2" />
                <Skeleton className="w-full h-[78px]" />
            </div>
        </div>
    )
}