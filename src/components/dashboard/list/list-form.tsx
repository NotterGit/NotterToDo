"use client"

import { Plus, X } from "lucide-react"
import { ListWrapper } from "./list-wapper"
import { ElementRef, useRef, useState } from "react";
import { useEventListener, useOnClickOutside } from "usehooks-ts";
import { FormInput } from "@/components/form/form-input";
import { useParams, useRouter } from "next/navigation";
import { FormSubmit } from "@/components/form/form-button";
import { Button } from "@/components/ui/button";
import { useAction } from "@/hooks/use-action";
import { createList } from "@/actions/create-list";
import toast from "react-hot-toast";

export default function ListForm() {
    const params = useParams()
    const router = useRouter()

    const formRef = useRef<ElementRef<"form">>(null);
    const inputRef = useRef<ElementRef<"input">>(null);

    const [isEditing, setIsEditing] = useState(false);

    const enableEditing = () => {
        setIsEditing(true);
        setTimeout(() => {
            inputRef.current?.focus();
        });
    };

    const disableEditing = () => {
        setIsEditing(false);
    }

    const { execute, fieldErrors } = useAction(createList, {
        onSuccess: () => {
            disableEditing();
            router.refresh()
        }
    })

    const onKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Escape") {
            disableEditing()
        }
    }

    useEventListener("keydown", onKeyDown)
    useOnClickOutside(formRef as React.RefObject<HTMLElement>, disableEditing)

    const onSubmit = (formData: FormData) => {
        const title = formData.get("title") as string
        const boardId = formData.get("boardId") as string

        toast.promise(execute({
            title,
            boardId
        }), {
            loading: "Создание списка...",
            success: (data) => `Список «${data.title}» создан`,
            error: (err) => err
        })
    }

    if (isEditing) {
        return (
            <ListWrapper>
                <form 
                    action={onSubmit}
                    ref={formRef}
                    className="w-full p-3 rounded-2xl bg-white/95 dark:bg-zinc-950/95 space-y-4 shadow-2xl backdrop-blur-xl border border-white/60 dark:border-white/10"
                >
                    <FormInput
                        ref={inputRef}
                        errors={fieldErrors}
                        id="title"
                        className="text-sm px-2.5 py-1.5 font-medium border-transparent hover:border-input focus:border-input transition rounded-xl" 
                        placeholder="Введите название списка"
                    />
                    <input 
                        hidden
                        value={params.boardId} 
                        name="boardId"
                    />
                    <div className="flex items-center gap-x-1.5">
                        <FormSubmit className="rounded-xl">
                            Добавить список
                        </FormSubmit>
                        <Button
                            onClick={disableEditing}
                            variant="ghost"
                            size="sm"
                            className="rounded-xl"
                        >
                            <X className="h-4 w-4"/>
                        </Button>
                    </div>
                </form>
            </ListWrapper>
        )
    }

    return (
        <ListWrapper>
            <button 
                className="w-full rounded-2xl bg-white/75 hover:bg-white/90 dark:bg-zinc-950/75 dark:hover:bg-zinc-950/90 text-foreground transition-all p-3 flex items-center font-semibold text-xs backdrop-blur-xl border border-dashed border-white/50 dark:border-white/10 shadow-lg hover:shadow-xl"
                onClick={enableEditing}
            >
                <Plus className="h-4 w-4 mr-2 text-yellow-500"/>
                Добавить список
            </button>
        </ListWrapper>
    )
}
