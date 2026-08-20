"use client"

import { List } from "@prisma/client"
import { Popover, PopoverClose, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { MoreHorizontal, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FormSubmit } from "@/components/form/form-button";
import { Separator } from "@/components/ui/separator";
import { useAction } from "@/hooks/use-action";
import { deleteList } from "@/actions/delete-list";
import toast from "react-hot-toast";
import { ElementRef, useRef } from "react";
import { copyList } from "@/actions/copy-list";

interface ListOptionsProps {
    data: List
    onAddCard: () => void
}

export function ListOptions({
    data, onAddCard
}: ListOptionsProps) {
    const closeRef = useRef<ElementRef<"button">>(null)
    
    const { execute: executeDelete } = useAction(deleteList, {
        onSuccess: (data) => {
            closeRef.current?.click()
        }
    })

    const { execute: executeCopy } = useAction(copyList, {
        onSuccess: (data) => {
            closeRef.current?.click()
        }
    })

    const onDelete = (formData: FormData) => {
        const id = formData.get("id") as string;
        const boardId = formData.get("boardId") as string

        toast.promise(executeDelete({id, boardId}), {
            loading: "Deleting list...",
            success: (data) => `List '${data.title}' deleted`,
            error: (err) => err
        })
    }

    const onCopy = (formData: FormData) => {
        const id = formData.get("id") as string;
        const boardId = formData.get("boardId") as string

        toast.promise(executeCopy({id, boardId}), {
            loading: "Copying list...",
            success: (data) => `List '${data.title}' copied`,
            error: (err) => err
        })
    }

    return (
        <Popover>
            <PopoverTrigger>
            <Button className="h-auto w-auto p-2" variant="ghost">
                <MoreHorizontal className="h-4 w-4" />
            </Button>
            </PopoverTrigger>
            <PopoverContent className="px-0 pt-3 pb-3 gap-1" side="bottom" align="start">
                <div className="text-sm font-medium text-center text-neutral-600 ">
                    List actions
                </div>
                <PopoverClose ref={closeRef}>
                    <Button className="h-auto w-auto p-2 absolute top-2 right-2 text-neutral-600" variant="ghost">
                        <X className="h-4 w-4"/>
                    </Button>
                </PopoverClose>

                <Button
                    onClick={onAddCard}
                    className="rounded-none w-full h-auto py-2 px-5 justify-start font-normal text-sm"
                    variant="ghost"
                >
                    Add card
                </Button>

                <form action={onCopy}>
                    <input hidden id="id" name="id" value={data.id} />
                    <input hidden id="boardId" name="boardId" value={data.boardId} />
                    <FormSubmit
                        variant="ghost"
                        className="rounded-none w-full h-auto py-2 px-5 justify-start font-normal text-sm"
                    >
                        Copy list
                    </FormSubmit>
                </form>

                <Separator className="h-[1px] my-0.5"/>

                <form action={onDelete}>
                    <input hidden id="id" name="id" value={data.id} />
                    <input hidden id="boardId" name="boardId" value={data.boardId} />
                    <FormSubmit
                        variant="ghost"
                        className="rounded-none w-full h-auto py-2 px-5 justify-start font-normal text-sm hover:bg-rose-500 hover:text-white"
                    >
                        Delete list
                    </FormSubmit>
                </form>
            </PopoverContent>
        </Popover>
    )
}