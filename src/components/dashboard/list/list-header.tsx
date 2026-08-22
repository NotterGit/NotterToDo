import { updateList } from "@/actions/update-list"
import { FormInput } from "@/components/form/form-input"
import { useAction } from "@/hooks/use-action"
import { ElementRef, useRef, useState } from "react"
import toast from "react-hot-toast"
import { useEventListener } from "usehooks-ts"
import { ListOptions } from "./list-options"
import type { ListHeaderProps } from "@/config/types/main.types"

export function ListHeader({
    data, onAddCard, isReadOnly = false
}: ListHeaderProps) {
    const [title, setTitle] = useState(data.title)
    const [isEditing, setIsEditing] = useState(false)

    const formRef = useRef<ElementRef<"form">>(null)
    const inputRef = useRef<ElementRef<"input">>(null)

    const enableEditing = () => {
        if (isReadOnly) return
        setIsEditing(true)
        setTimeout(() => {
            inputRef.current?.focus()
            inputRef.current?.select()
        })
    }

    const disableEditing = () => {
        setIsEditing(false)
    }

    const { execute } = useAction(updateList)

    const handleSubmit = (formData: FormData) => {
        const title = formData.get("title") as string
        const id = formData.get("id") as string
        const boardId = formData.get("boardId") as string

        if (title === data.title) {
            return disableEditing()
        }

        toast.promise(execute({
            title,
            id,
            boardId
        }), {
            loading: "Обновление названия...",
            success: (data) => `Переименовано в «${data.title}»`,
            error: (err) => err
        }).then((data) => {
            setTitle(data.title)
            disableEditing()
        }).catch(() => {
            disableEditing()
        })
    }

    const onBlur = () => {
        formRef.current?.requestSubmit()
    }

    const onKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Escape") {
            formRef.current?.requestSubmit()
        }
    }

    useEventListener("keydown", onKeyDown)
    
    return (
        <div className="pt-2 px-2 text-sm font-semibold flex justify-between items-start gap-x-2 shrink-0">
            {isEditing && !isReadOnly ? (
                <form
                    action={handleSubmit}
                    ref={formRef}
                    className="flex-1 px-[2px]"
                >
                    <input hidden id="id" name="id" value={data.id} />
                    <input hidden id="boardId" name="boardId" value={data.boardId} />
                    <FormInput
                        ref={inputRef}
                        onBlur={onBlur}
                        id="title"
                        placeholder="Введите название списка"
                        defaultValue={title}
                        className="text-sm px-[7px] py-1 h-7 font-medium border-transparent hover:border-input focus:border-input transition truncate bg-transparent focus:bg-white dark:focus:bg-neutral-800"
                    />
                    <button type="submit" hidden/>
                </form>
            ) : (
                <div 
                    className="w-full text-sm px-2.5 py-1 h-7 font-medium border-transparent"
                    onClick={enableEditing}
                >
                    {data.title}
                </div>
            )}
            {!isReadOnly && (
                <ListOptions
                    data={data}
                    onAddCard={onAddCard}
                />
            )}
        </div>
    )
}
