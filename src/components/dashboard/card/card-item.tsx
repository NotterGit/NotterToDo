"use client"

import { Draggable } from "@hello-pangea/dnd"
import { useCardModal } from "@/hooks/use-card-modal"
import type { CardItemProps } from "@/config/types/main.types"

export function CardItem({
    data, index, isReadOnly = false
}: CardItemProps) {
    const cardModal = useCardModal()

    return (
        <Draggable draggableId={data.id} index={index} isDragDisabled={isReadOnly}>
            {(provided) => (
                <div 
                    className="break-words whitespace-normal border border-border/60 bg-card dark:bg-zinc-900 dark:border-white/10 dark:text-neutral-100 rounded-xl shadow-sm hover:shadow-md hover:border-yellow-400/50 dark:hover:border-yellow-400/40 transition-[border-color,box-shadow,background-color] duration-150 py-2.5 px-3 text-sm font-medium select-none" 
                    role="button"
                    onClick={() => cardModal.onOpen(data.id)}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    ref={provided.innerRef}
                >
                    {data.title}
                </div>
            )}
        </Draggable>
    )
}