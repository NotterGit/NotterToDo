"use client"

import { deleteBoard } from "@/actions/delete-board/index";
import { Button } from "@/components/ui/button";
import { Popover, PopoverClose, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useAction } from "@/hooks/use-action";
import { MoreHorizontal, X } from "lucide-react";
import toast from "react-hot-toast";
import type { BoardOptionsProps } from "@/config/types/main.types";

export default function BoardOptions({
    id
}: BoardOptionsProps) {
    const { execute, isLoading } = useAction(deleteBoard)

    const onDelete = () => {
        toast.promise(execute({ id }), {
            loading: "Удаление доски...",
            success: "Доска удалена!",
            error: (err) => err
        })
    }

    return (
        <Popover>
            <PopoverTrigger>
                <Button className="h-auto w-auto p-2" variant="transparent">
                    <MoreHorizontal className="h-4 w-4" />
                </Button>
            </PopoverTrigger>
            <PopoverContent
                className="px-0 pt-3 pb-3 gap-1"
                side="bottom"
                align="start"
            >
                <div className="text-sm font-medium text-center text-neutral-600 dark:text-neutral-300 pb-1">
                    Действия с доской
                </div>
                <PopoverClose>
                    <Button 
                        className="h-auto w-auto p-2 absolute top-2 right-2 text-neutral-600 dark:text-neutral-300"
                        variant="ghost"
                    >
                        <X className="h-4 w-4"/>
                    </Button>
                </PopoverClose>
                <Button
                    variant="ghost"
                    onClick={onDelete}
                    disabled={isLoading}
                    className="rounded-none w-full h-auto py-2 px-5 justify-start font-normal text-sm hover:bg-rose-500 hover:text-white"
                >
                    Удалить эту доску
                </Button>
            </PopoverContent>
        </Popover>
    );
}
