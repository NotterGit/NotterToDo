"use client"

import { updateBoard } from "@/actions/update-board"
import { FormInput } from "@/components/form/form-input"
import { Button } from "@/components/ui/button"
import { useAction } from "@/hooks/use-action"
import { Board } from "@prisma/client"
import { ElementRef, useRef, useState } from "react"
import toast from "react-hot-toast"

interface BoardTitleProps {
    data: Board
}

export function BoardTitle({
    data
}: BoardTitleProps) {
    const { execute } = useAction(updateBoard)

    const formRef = useRef<ElementRef<"form">>(null)
    const inputRef = useRef<ElementRef<"input">>(null)

    const [title, setTitle] = useState(data.title)
    const [isEditing, setIdEditing] = useState(false)

    const enableEditing = () => {
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
        const title = formData.get("title") as string
        
        toast.promise(execute({
            title,
            id: data.id
        }), {
            loading: "Updating title...",
            success: `Board '${title}' updated!`,
            error: (err) => err
        }).then(() => {
            setTitle(title)
            disableEditing()
        }).catch(() => {
            disableEditing()
        })
    }

    const onBlur = () => {
        formRef.current?.requestSubmit()
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
                    className="text-lg font-bold px-[7px] py-1 h-7 bg-transparent focus-visible:outline-none focus-visible:ring-transparent border-none"
                />
            </form>
        )
    }

    return (
        <Button
            onClick={enableEditing}
            variant="transparent"
            className="font-bold text-lg h-auto w-auto p-1 px-2"
        >
            {title}
        </Button>
    )
}