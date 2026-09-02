"use client"

import { useState, useEffect } from "react";
import { copyCard } from "@/actions/copy-card";
import { deleteCard } from "@/actions/delete-card";
import { updateCard } from "@/actions/update-card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ColorPicker } from "@/components/dashboard/color-picker";
import { getItemColor } from "@/config/const/colors.const";
import { useAction } from "@/hooks/use-action";
import { useCardModal } from "@/hooks/use-card-modal";
import { useQueryClient } from "@tanstack/react-query";
import { Copy, Palette, Trash } from "lucide-react";
import { useParams } from "next/navigation";
import toast from "react-hot-toast";
import { cn } from "@/lib/utils";
import type { ActionsProps } from "@/config/types/modals.types";

export default function Actions({
    data,
    onPreviewColorChange,
}: ActionsProps) {
    const params = useParams()
    const cardModal = useCardModal()
    const queryClient = useQueryClient()
    const [isOpen, setIsOpen] = useState(false)
    const [selectedColor, setSelectedColor] = useState<string | null>(data.color)

    useEffect(() => {
        setSelectedColor(data.color)
    }, [data.color])

    const currentColor = getItemColor(selectedColor)

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
    const { execute: executeUpdateCard, isLoading: isLoadingUpdate } = useAction(updateCard, {
        onSuccess: (updatedCard) => {
            queryClient.invalidateQueries({
                queryKey: ["card", updatedCard.id]
            })
            queryClient.invalidateQueries({
                queryKey: ["card-logs", updatedCard.id]
            })
        }
    })

    if (data.canEdit === false) {
        return null
    }

    const handleOpenChange = (open: boolean) => {
        setIsOpen(open)
        if (open) {
            setSelectedColor(data.color)
            onPreviewColorChange?.(data.color)
        } else {
            const newColor = selectedColor
            onPreviewColorChange?.(undefined)

            if (newColor !== data.color) {
                const boardId = params.boardId as string
                toast.promise(executeUpdateCard({
                    id: data.id,
                    boardId,
                    color: newColor,
                }), {
                    loading: "Обновление цвета...",
                    success: "Цвет карточки обновлен",
                    error: (err) => err || "Не удалось обновить цвет"
                })
            }
        }
    }

    const handleColorClick = (colorId: string | null) => {
        setSelectedColor(colorId)
        onPreviewColorChange?.(colorId)
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
      <Popover open={isOpen} onOpenChange={handleOpenChange}>
        <PopoverTrigger
          render={
            <Button
              variant="outline"
              size="sm"
              className="w-full justify-start rounded-xl font-medium"
              disabled={isLoadingUpdate}
            >
              {currentColor ? (
                <span className={cn("w-3.5 h-3.5 rounded-full mr-1.5 shrink-0", currentColor.swatch)} />
              ) : (
                <Palette className="h-4 w-4 mr-1.5" />
              )}
              Цвет
            </Button>
          }
        />
        <PopoverContent className="w-64 p-3" side="bottom" align="start">
          <p className="text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider mb-2">
            Цвет карточки
          </p>
          <ColorPicker
            value={selectedColor}
            onChange={handleColorClick}
            disabled={isLoadingUpdate}
          />
        </PopoverContent>
      </Popover>
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
      <Skeleton className="w-full h-8 rounded-xl" />
      <Skeleton className="w-full h-8 rounded-xl" />
      <Skeleton className="w-full h-8 rounded-xl" />
    </div>
  )
}
