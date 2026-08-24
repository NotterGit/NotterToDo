"use client"

import { updateCard } from "@/actions/update-card";
import { FormInput } from "@/components/form/form-input";
import { Skeleton } from "@/components/ui/skeleton";
import { useAction } from "@/hooks/use-action";
import { useCardRename } from "@/hooks/use-card-rename";
import { useQueryClient } from "@tanstack/react-query";
import { Layout } from "lucide-react"
import { useParams } from "next/navigation";
import { ElementRef, useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import type { HeaderProps } from "@/config/types/modals.types";

export function Header({
    data
}: HeaderProps) {
    const queryClient = useQueryClient()
    const params = useParams()

    const isRenaming = useCardRename((state) => !!state.renamingCardIds[data.id])
    const startRenaming = useCardRename((state) => state.startRenaming)
    const stopRenaming = useCardRename((state) => state.stopRenaming)

    const [title, setTitle] = useState(data?.title)
    const inputRef = useRef<ElementRef<"input">>(null)

    useEffect(() => {
        setTitle(data.title)
    }, [data.title])

    const { execute } = useAction(updateCard, {
        onSuccess: (updatedCard) => {
            queryClient.invalidateQueries({
                queryKey: ["card", updatedCard.id]
            })

            queryClient.invalidateQueries({
                queryKey: ["card-logs", updatedCard.id]
            })

            setTitle(updatedCard.title);
        }
    })

    const onBlur = () => {
        if (!isRenaming) {
            inputRef.current?.form?.requestSubmit()
        }
    }

    const onSubmit = (formData: FormData) => {
        const newTitle = formData.get("title") as string
        const boardId = params.boardId as string

        if (isRenaming) {
            return
        }

        if (!newTitle || newTitle.trim() === "" || newTitle === data.title) {
            setTitle(data.title)
            return
        }

        startRenaming(data.id)

        const promise = execute({
            title: newTitle,
            boardId,
            id: data.id
        }).finally(() => {
            stopRenaming(data.id)
        })

        toast.promise(promise, {
            loading: "Переименование...",
            success: (res) => `Переименовано в «${res.title}»`,
            error: (err) => err || "Не удалось переименовать"
        })
    }

    return (
    <div className="flex items-start gap-x-3 mb-6 w-full">
        <Layout className="h-5 w-5 mt-1 text-neutral-700 dark:text-neutral-300" />
        <div className="w-full">
            {data.canEdit === false ? (
                <h4 className="font-semibold text-xl px-1 text-neutral-700 dark:text-neutral-200 mb-0.5 break-words select-none">
                    {title}
                </h4>
            ) : (
                <form action={onSubmit}>
                    <FormInput
                        key={`${data.id}-${title}`}
                        ref={inputRef}
                        onBlur={onBlur}
                        id="title"
                        defaultValue={title}
                        disabled={isRenaming}
                        className="font-semibold text-xl px-1 text-neutral-700 dark:text-neutral-200 bg-transparent border-transparent relative -left-1.5 w-[95%] focus-visible:bg-white dark:focus-visible:bg-neutral-800 focus-visible:border-input mb-0.5 truncate disabled:opacity-70 disabled:cursor-not-allowed"
                    />
                </form>
            )}
            <p className="text-sm text-muted-foreground">
                в списке <span className="font-semibold">{data.list.title}</span>
            </p>
        </div>
    </div>
    )
}

Header.Skeleton = function HeaderSkeleton() {
    return (
        <div className="flex items-start gap-x-3 mb-6">
            <Skeleton className="h-6 w-6 mt-1" />
            <div className="space-y-1">
                <Skeleton className="w-24 h-6 mb-1" />
                <Skeleton className="w-20 h-4" />
            </div>
        </div>
    )
}