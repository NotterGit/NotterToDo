"use client"

import { updateBoard } from "@/actions/update-board"
import { FormInput } from "@/components/form/form-input"
import { Button } from "@/components/ui/button"
import { useAction } from "@/hooks/use-action"
import { ElementRef, useRef, useState } from "react"
import toast from "react-hot-toast"
import type { BoardTitleProps } from "@/config/types/main.types"

export function BoardTitle({
    data,
    isReadOnly = false
}: BoardTitleProps) {
    const { execute } = useAction(updateBoard)

    const formRef = useRef<ElementRef<"form">>(null)
    const inputRef = useRef<ElementRef<"input">>(null)

    const [title, setTitle] = useState(data.title)
    const [isEditing, setIdEditing] = useState(false)

    const enableEditing = () => {
        if (isReadOnly) return
        setIdEditing(true)
        setTimeout(() => {
            inputRef.current?.focus()
            inputRef.current?.select()
        })
    }

    const disableEditing = () => {
        setIdEditing(false)
    }

    const onSubmit = (formData: FormData) => {
        const newTitle = formData.get("title") as string
        
        if (newTitle === title) {
            return disableEditing()
        }

        toast.promise(execute({
            title: newTitle,
            id: data.id
        }), {
            loading: "Обновление названия...",
            success: `Доска «${newTitle}» обновлена!`,
            error: (err) => err
        }).then(() => {
            setTitle(newTitle)
            disableEditing()
        }).catch(() => {
            disableEditing()
        })
    }

    const onBlur = () => {
        formRef.current?.requestSubmit()
    }

    if (isReadOnly) {
        return (
            <div className="font-bold text-lg px-2 text-white select-none">
                {title}
            </div>
        )
    }

    if(isEditing) {
        return (
            <form 
                action={onSubmit}
                ref={formRef}
                className="flex items-center gap-x-2"
            >
                <FormInput
                    id="title"
                    onBlur={onBlur}
                    defaultValue={title}
                    ref={inputRef}
                    className="text-lg font-bold px-[7px] py-1 h-7 bg-transparent focus-visible:outline-none focus-visible:ring-transparent border-none text-white"
                />
            </form>
        )
    }

    return (
        <Button
            onClick={enableEditing}
            variant="transparent"
            className="font-bold text-lg h-auto w-auto py-1 px-2.5 rounded-xl hover:bg-white/15 transition-all"
        >
            {title}
        </Button>
    )
}