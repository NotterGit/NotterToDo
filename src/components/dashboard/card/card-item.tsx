"use client"

import { Draggable } from "@hello-pangea/dnd"
import { useCardModal } from "@/hooks/use-card-modal"
import type { CardItemProps } from "@/config/types/main.types"
import { getItemColor } from "@/config/const/colors.const"
import { cn } from "@/lib/utils"

export function CardItem({
    data, index, isReadOnly = false
}: CardItemProps) {
    const cardModal = useCardModal()
    const colorConfig = getItemColor(data.color)

    return (
        <Draggable draggableId={data.id} index={index} isDragDisabled={isReadOnly}>
            {(provided) => (
                <div 
                    className={cn(
                        "break-words whitespace-normal border rounded-xl shadow-xs hover:shadow-md transition-[border-color,box-shadow,background-color] duration-150 text-sm font-medium select-none relative overflow-hidden",
                        colorConfig
                            ? cn(colorConfig.card.bg, colorConfig.card.hoverBorder)
                            : "bg-card dark:bg-zinc-900 dark:text-neutral-100 border-border/60 dark:border-white/10 hover:border-yellow-400/50 dark:hover:border-yellow-400/40"
                    )}
                    role="button"
                    onClick={() => cardModal.onOpen(data.id)}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    ref={provided.innerRef}
                >
                    {colorConfig && (
                        <div className={cn("h-1.5 w-full shrink-0", colorConfig.card.bar)} />
                    )}
                    <div className="py-2.5 px-3">
                        {data.title}
                    </div>
                </div>
            )}
        </Draggable>
    )
}