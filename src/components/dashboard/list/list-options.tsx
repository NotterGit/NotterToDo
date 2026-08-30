"use client"

import { Popover, PopoverClose, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Copy, MoreHorizontal, Plus, Trash2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FormSubmit } from "@/components/form/form-button";
import { Separator } from "@/components/ui/separator";
import { useAction } from "@/hooks/use-action";
import { deleteList } from "@/actions/delete-list";
import { updateList } from "@/actions/update-list";
import toast from "react-hot-toast";
import { ElementRef, useRef } from "react";
import { copyList } from "@/actions/copy-list";
import type { ListOptionsProps } from "@/config/types/main.types";
import { ColorPicker } from "../color-picker";

export function ListOptions({
    data, onAddCard
}: ListOptionsProps) {
    const closeRef = useRef<ElementRef<"button">>(null)
    
    const { execute: executeDelete } = useAction(deleteList, {
        onSuccess: () => {
            closeRef.current?.click()
        }
    })

    const { execute: executeCopy } = useAction(copyList, {
        onSuccess: () => {
            closeRef.current?.click()
        }
    })

    const { execute: executeUpdate, isLoading: isLoadingUpdate } = useAction(updateList)

    const onColorChange = (color: string | null) => {
        toast.promise(executeUpdate({
            id: data.id,
            boardId: data.boardId,
            color,
        }), {
            loading: "Обновление цвета...",
            success: "Цвет списка обновлен",
            error: (err) => err || "Не удалось обновить цвет"
        })
    }

    const onDelete = (formData: FormData) => {
        const id = formData.get("id") as string;
        const boardId = formData.get("boardId") as string

        toast.promise(executeDelete({id, boardId}), {
            loading: "Удаление списка...",
            success: (data) => `Список «${data.title}» удалён`,
            error: (err) => err
        })
    }

    const onCopy = (formData: FormData) => {
        const id = formData.get("id") as string;
        const boardId = formData.get("boardId") as string

        toast.promise(executeCopy({id, boardId}), {
            loading: "Копирование списка...",
            success: (data) => `Список «${data.title}» скопирован`,
            error: (err) => err
        })
    }

    return (
        <Popover>
            <PopoverTrigger>
                <Button className="h-8 w-8 p-0 shrink-0 rounded-lg hover:bg-black/5 dark:hover:bg-white/10" variant="ghost">
                    <MoreHorizontal className="h-4 w-4" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="px-0 pt-3 pb-3 gap-1 w-64" side="bottom" align="start">
                <div className="text-sm font-medium text-center text-neutral-600 dark:text-neutral-300">
                    Действия со списком
                </div>
                <PopoverClose ref={closeRef}>
                    <Button className="h-auto w-auto p-2 absolute top-2 right-2 text-neutral-600 dark:text-neutral-300" variant="ghost">
                        <X className="h-4 w-4"/>
                    </Button>
                </PopoverClose>

                <Button
                    onClick={onAddCard}
                    className="rounded-none w-full h-auto py-2 px-5 justify-start font-normal text-sm"
                    variant="ghost"
                >
                    <Plus className="h-4 w-4 mr-2" />
                    Добавить карточку
                </Button>

                <form action={onCopy}>
                    <input hidden id="id" name="id" value={data.id} />
                    <input hidden id="boardId" name="boardId" value={data.boardId} />
                    <FormSubmit
                        variant="ghost"
                        className="rounded-none w-full h-auto py-2 px-5 justify-start font-normal text-sm"
                    >
                        <Copy className="h-4 w-4 mr-2" />
                        Копировать список
                    </FormSubmit>
                </form>

                <Separator className="h-[1px] my-1"/>

                <div className="px-5 py-1 text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                    Цвет списка
                </div>
                <div className="px-4 py-1">
                    <ColorPicker
                        value={data.color}
                        onChange={onColorChange}
                        disabled={isLoadingUpdate}
                    />
                </div>

                <Separator className="h-[1px] my-1"/>

                <form action={onDelete}>
                    <input hidden id="id" name="id" value={data.id} />
                    <input hidden id="boardId" name="boardId" value={data.boardId} />
                    <FormSubmit
                        variant="ghost"
                        className="rounded-none w-full h-auto py-2 px-5 justify-start font-normal text-sm hover:bg-rose-500 hover:text-white dark:hover:bg-rose-600 transition-colors"
                    >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Удалить список
                    </FormSubmit>
                </form>
            </PopoverContent>
        </Popover>
    )
}