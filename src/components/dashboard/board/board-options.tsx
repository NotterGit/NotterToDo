"use client"

import { deleteBoard } from "@/actions/delete-board/index";
import { Button } from "@/components/ui/button";
import { Popover, PopoverClose, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ConfirmModal } from "@/components/modals/confirm-modal";
import { useAction } from "@/hooks/use-action";
import { useAuth } from "@clerk/nextjs";
import { MoreHorizontal, Trash2, X } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { pages } from "@/config/routing/pages.route";
import toast from "react-hot-toast";
import type { BoardOptionsProps } from "@/config/types/main.types";

export default function BoardOptions({
    id
}: BoardOptionsProps) {
    const router = useRouter()
    const { userId, orgId, orgRole, isLoaded } = useAuth()
    const [isConfirmOpen, setIsConfirmOpen] = useState(false)
    const [isPopoverOpen, setIsPopoverOpen] = useState(false)

    const targetOrgId = orgId || userId

    const { execute, isLoading } = useAction(deleteBoard, {
        onSuccess: () => {
            if (targetOrgId) {
                router.push(pages.DASHBOARD(targetOrgId))
            }
        },
        onError: (error) => {
            toast.error(typeof error === "string" ? error : "Не удалось удалить доску")
        }
    })

    const isOrgAdmin =
        orgRole === "org:admin" ||
        orgRole === "admin" ||
        (typeof orgRole === "string" && orgRole.includes("admin"))
    const canDelete = !orgId || isOrgAdmin

    if (!isLoaded || !canDelete) {
        return null
    }

    const onDelete = () => {
        setIsPopoverOpen(false)
        setIsConfirmOpen(true)
    }

    const onConfirmDelete = () => {
        setIsConfirmOpen(false)
        toast.promise(execute({ id }), {
            loading: "Удаление доски...",
            success: "Доска удалена!",
            error: (err) => (typeof err === "string" ? err : err?.message || "Не удалось удалить доску")
        })
    }

    return (
        <>
            <ConfirmModal
                isOpen={isConfirmOpen}
                onClose={() => setIsConfirmOpen(false)}
                onConfirm={onConfirmDelete}
                title="Удалить доску?"
                description="Вы уверены, что хотите удалить эту доску? Все списки, карточки и связанные данные будут безвозвратно удалены."
                confirmText="Удалить доску"
                cancelText="Отмена"
                disabled={isLoading}
            />
            <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
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
                        className="rounded-none w-full h-auto py-2 px-5 justify-start font-normal text-sm hover:bg-rose-500 hover:text-white dark:hover:bg-rose-600 transition-colors"
                    >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Удалить эту доску
                    </Button>
                </PopoverContent>
            </Popover>
        </>
    );
}
