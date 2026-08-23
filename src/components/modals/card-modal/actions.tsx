"use client"

import { copyCard } from "@/actions/copy-card";
import { deleteCard } from "@/actions/delete-card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useAction } from "@/hooks/use-action";
import { useCardModal } from "@/hooks/use-card-modal";
import { Copy, Trash } from "lucide-react";
import { useParams } from "next/navigation";
import toast from "react-hot-toast";
import type { ActionsProps } from "@/config/types/modals.types";

export default function Actions({
    data
}: ActionsProps) {
    const params = useParams()
    const cardModal = useCardModal()

    const { execute: executeCopyCard, isLoading: isLoadingCopy } = useAction(copyCard, {
        onSuccess: () => {
            cardModal.onClose()
        }
    })
    const { execute: executeDeleteCard, isLoading: isLoadingDelete } = useAction(deleteCard, {
        onSuccess: () => {
            cardModal.onClose()
        }
    })

    if (data.canEdit === false) {
        return null
    }

    const onCopy = () => {
        const boardId = params.boardId as string

        toast.promise(executeCopyCard({
            id: data.id,
            boardId
        }), {
            loading: "Копирование...",
            success: (data) => `Карточка «${data.title}» скопирована`,
            error: (err) => err
        })
    }

    const onDelete = () => {
        const boardId = params.boardId as string

        toast.promise(executeDeleteCard({
            id: data.id,
            boardId
        }), {
            loading: "Удаление...",
            success: (data) => `Карточка «${data.title}» удалена`,
            error: (err) => err
        })
    }

  return (
    <div className="space-y-2 mt-2">
      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
        Действия
      </p>
      <Button
        variant="outline"
        size="sm"
        className="w-full justify-start rounded-xl font-medium"
        onClick={onCopy}
        disabled={isLoadingCopy}
      >
        <Copy className="h-4 w-4 mr-1.5" />
        Копировать
      </Button>
      <Button
        variant="outline"
        size="sm"
        className="w-full justify-start rounded-xl font-medium hover:bg-rose-500 hover:text-white hover:border-rose-500 dark:hover:bg-rose-600 dark:hover:border-rose-600 transition-colors"
        onClick={onDelete}
        disabled={isLoadingDelete}
      >
        <Trash className="h-4 w-4 mr-1.5" />
        Удалить
      </Button>
    </div>
  )
}

Actions.Skeleton = function ActionsSkeleton() {
  return (
    <div className="space-y-2 mt-2">
      <Skeleton className="w-20 h-4 rounded-md" />
      <Skeleton className="w-full h-9 rounded-xl" />
      <Skeleton className="w-full h-9 rounded-xl" />
    </div>
  )
}
