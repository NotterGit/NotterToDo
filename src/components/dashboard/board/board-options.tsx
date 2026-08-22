"use client"

import { deleteBoard } from "@/actions/delete-board/index";
import { updateBoardPublic } from "@/actions/update-board-public";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Popover, PopoverClose, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ConfirmModal } from "@/components/modals/confirm-modal";
import { Separator } from "@/components/ui/separator";
import { useAction } from "@/hooks/use-action";
import { useAuth } from "@clerk/nextjs";
import { Check, Copy, ExternalLink, Globe, Lock, MoreHorizontal, Trash2, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { pages } from "@/config/routing/pages.route";
import toast from "react-hot-toast";
import type { BoardOptionsProps } from "@/config/types/main.types";

export default function BoardOptions({
    id,
    initialPublic = false
}: BoardOptionsProps) {
    const router = useRouter()
    const { userId, orgId, orgRole } = useAuth()
    const [isConfirmOpen, setIsConfirmOpen] = useState(false)
    const [isPopoverOpen, setIsPopoverOpen] = useState(false)
    const [isPublic, setIsPublic] = useState(initialPublic)
    const [isCopied, setIsCopied] = useState(false)
    const [boardUrl, setBoardUrl] = useState("")

    useEffect(() => {
        setIsPublic(initialPublic)
    }, [initialPublic])

    useEffect(() => {
        if (typeof window !== "undefined") {
            setBoardUrl(`${window.location.origin}${pages.BOARD(id)}`)
        }
    }, [id])

    const targetOrgId = orgId || userId

    const { execute: executeDelete, isLoading: isLoadingDelete } = useAction(deleteBoard, {
        onSuccess: () => {
            if (targetOrgId) {
                router.push(pages.DASHBOARD(targetOrgId))
            }
        },
        onError: (error) => {
            toast.error(typeof error === "string" ? error : "Не удалось удалить доску")
        }
    })

    const { execute: executeUpdatePublic, isLoading: isLoadingPublic } = useAction(updateBoardPublic, {
        onSuccess: (data) => {
            setIsPublic(data.public)
            toast.success(data.public ? "Доска теперь публичная" : "Доска теперь приватная")
            router.refresh()
        },
        onError: (error) => {
            toast.error(typeof error === "string" ? error : "Не удалось обновить статус доступа")
        }
    })

    const isOrgAdmin =
        orgRole === "org:admin" ||
        orgRole === "admin" ||
        (typeof orgRole === "string" && orgRole.includes("admin"))
    const canDelete = !orgId || isOrgAdmin

    const onTogglePublic = () => {
        executeUpdatePublic({
            id,
            public: !isPublic
        })
    }

    const onCopy = () => {
        if (!boardUrl) return
        navigator.clipboard.writeText(boardUrl)
        setIsCopied(true)
        toast.success("Ссылка скопирована!")
        setTimeout(() => setIsCopied(false), 2000)
    }

    const onDelete = () => {
        setIsPopoverOpen(false)
        setIsConfirmOpen(true)
    }

    const onConfirmDelete = () => {
        setIsConfirmOpen(false)
        toast.promise(executeDelete({ id }), {
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
                disabled={isLoadingDelete}
            />
            <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
                <PopoverTrigger>
                    <Button className="h-auto w-auto p-2" variant="transparent">
                        <MoreHorizontal className="h-4 w-4" />
                    </Button>
                </PopoverTrigger>
                <PopoverContent
                    className="px-0 pt-3 pb-3 gap-1 w-80"
                    side="bottom"
                    align="start"
                >
                    <div className="text-sm font-medium text-center text-neutral-600 dark:text-neutral-300 pb-2">
                        Настройки доски
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
                        onClick={onTogglePublic}
                        disabled={isLoadingPublic}
                        className="rounded-none w-full h-auto py-2.5 px-5 justify-start font-normal text-sm hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                    >
                        {isPublic ? (
                            <>
                                <Lock className="h-4 w-4 mr-2 text-rose-500" />
                                Сделать приватной
                            </>
                        ) : (
                            <>
                                <Globe className="h-4 w-4 mr-2 text-emerald-500" />
                                Сделать публичной
                            </>
                        )}
                    </Button>

                    {isPublic && (
                        <div className="px-4 py-2 space-y-2 bg-neutral-50 dark:bg-neutral-900/50 border-y border-border">
                            <div className="flex items-center justify-between text-xs text-muted-foreground">
                                <span>Ссылка на доску</span>
                                <span className="text-[11px] font-medium text-emerald-600 dark:text-emerald-400">Публичная</span>
                            </div>
                            <div className="flex items-center gap-x-2">
                                <Input
                                    readOnly
                                    value={boardUrl}
                                    className="h-8 text-xs bg-white dark:bg-neutral-900 text-neutral-700 dark:text-neutral-200 select-all font-mono"
                                />
                                <Button
                                    type="button"
                                    size="sm"
                                    variant="outline"
                                    className="h-8 px-2.5 shrink-0"
                                    onClick={onCopy}
                                    title="Скопировать ссылку"
                                >
                                    {isCopied ? (
                                        <Check className="h-4 w-4 text-emerald-600" />
                                    ) : (
                                        <Copy className="h-4 w-4" />
                                    )}
                                </Button>
                            </div>
                            {boardUrl && (
                                <a
                                    href={boardUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center justify-center gap-x-1.5 w-full py-1 text-xs text-emerald-600 dark:text-emerald-400 hover:underline transition-colors"
                                >
                                    <ExternalLink className="h-3.5 w-3.5" />
                                    <span>Открыть новой вкладке</span>
                                </a>
                            )}
                        </div>
                    )}

                    {canDelete && (
                        <>
                            <Separator className="my-1" />

                            <Button
                                variant="ghost"
                                onClick={onDelete}
                                disabled={isLoadingDelete}
                                className="rounded-none w-full h-auto py-2.5 px-5 justify-start font-normal text-sm hover:bg-rose-500 hover:text-white dark:hover:bg-rose-600 transition-colors"
                            >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Удалить эту доску
                            </Button>
                        </>
                    )}
                </PopoverContent>
            </Popover>
        </>
    );
}
