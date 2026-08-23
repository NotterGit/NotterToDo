"use client"

import { createCard } from "@/actions/create-card"
import { FormSubmit } from "@/components/form/form-button"
import { FormTextarea } from "@/components/form/form-textarea"
import { Button } from "@/components/ui/button"
import { useAction } from "@/hooks/use-action"
import { Plus, X } from "lucide-react"
import { useParams } from "next/navigation"
import { ElementRef, forwardRef, KeyboardEventHandler, useRef } from "react"
import toast from "react-hot-toast"
import { useEventListener, useOnClickOutside } from "usehooks-ts"
import type { CardFormProps } from "@/config/types/main.types"

export const CardForm = forwardRef<HTMLTextAreaElement, CardFormProps>(({
    listId, enableEditing, disableEditing, isEditing
}, ref) => {
    const params = useParams()
    const formRef = useRef<ElementRef<"form">>(null)

    const { execute, fieldErrors } = useAction(createCard, {
        onSuccess: () => {
            formRef.current?.reset()
        }
    })

    const onKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Escape") {
            disableEditing()
        }
    }

    useOnClickOutside(formRef as React.RefObject<HTMLElement>, disableEditing);
    useEventListener("keydown", onKeyDown);

    const onTextareaKeyDown: KeyboardEventHandler<HTMLTextAreaElement> = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault()
            formRef.current?.requestSubmit()
        }
    }

    const onSubmit = (formData: FormData) => {
        const title = formData.get("title") as string
        const listId = formData.get("listId") as string
        const boardId = params.boardId as string

        toast.promise(execute({ title, listId, boardId }), {
            loading: "Создание карточки...",
            success: (data) => `Карточка «${data.title}» создана`,
            error: (error) => error
        })
    }

    if(isEditing){
        return (
            <form
                ref={formRef}
                action={onSubmit}
                className="m-1 py-0.5 px-1 space-y-4 shrink-0"
            >
                <FormTextarea
                    id="title"
                    onKeyDown={onTextareaKeyDown}
                    ref={ref}
                    placeholder="Введите название карточки..."
                    errors={fieldErrors}
                    onClick={() => {}}
                />
                <input
                    hidden
                    id="listId"
                    name="listId"
                    value={listId}
                />
                <div className="flex items-center gap-x-1.5">
                    <FormSubmit className="rounded-xl">
                        Добавить карточку
                    </FormSubmit>
                    <Button onClick={disableEditing} variant="ghost" size="sm" className="rounded-xl">
                        <X className="h-4 w-4"/>
                    </Button>
                </div>
            </form>
        )
    }

    return (
        <div className="pt-2 px-2 shrink-0">
            <Button
                onClick={enableEditing}
                className="h-auto px-2.5 py-1.5 w-full justify-start text-muted-foreground hover:text-foreground text-sm rounded-xl transition-all"
                size="sm"
                variant="ghost"
            >
                <Plus className="h-4 w-4 mr-2 text-yellow-500" />
                Добавить карточку
            </Button>
        </div>
    )
})

CardForm.displayName = "CardForm"