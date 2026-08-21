"use client"

import { updateCard } from "@/actions/update-card";
import { FormInput } from "@/components/form/form-input";
import { Skeleton } from "@/components/ui/skeleton";
import { useAction } from "@/hooks/use-action";
import { useQueryClient } from "@tanstack/react-query";
import { Layout } from "lucide-react"
import { useParams } from "next/navigation";
import { ElementRef, useRef, useState } from "react";
import toast from "react-hot-toast";
import type { HeaderProps } from "@/config/types/modals.types";

export function Header({
    data
}: HeaderProps) {
    const queryClient = useQueryClient()
    const params = useParams()

    const { execute } = useAction(updateCard, {
        onSuccess: (data) => {
            queryClient.invalidateQueries({
                queryKey: ["card", data.id]
            })

            queryClient.invalidateQueries({
                queryKey: ["card-logs", data.id]
            })

            setTitle(data.title);
        }
    })

    const inputRef = useRef<ElementRef<"input">>(null)

    const [title, setTitle] = useState(data?.title)

    const onBlur = () => {
        inputRef.current?.form?.requestSubmit()
    }

    const onSubmit = (formData: FormData) => {
        const title = formData.get("title") as string
        const boardId = params.boardId as string

        if (title === data.title) {
            return
        }

        toast.promise(execute({
            title,
            boardId,
            id: data.id
        }), {
            loading: "Переименование...",
            success: (data) => `Переименовано в «${data.title}»`,
            error: (err) => err
        })
    }

    return (
    <div className="flex items-start gap-x-3 mb-6 w-full">
        <Layout className="h-5 w-5 mt-1 text-neutral-700 dark:text-neutral-300" />
        <div className="w-full">
            <form action={onSubmit}>
                <FormInput
                    ref={inputRef}
                    onBlur={onBlur}
                    id="title"
                    defaultValue={title}
                    className="font-semibold text-xl px-1 text-neutral-700 dark:text-neutral-200 bg-transparent border-transparent relative -left-1.5 w-[95%] focus-visible:bg-white dark:focus-visible:bg-neutral-800 focus-visible:border-input mb-0.5 truncate"
                />
            </form>
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