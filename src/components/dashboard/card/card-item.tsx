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
                    className="truncate border-2 border-transparent hover:border-black dark:hover:border-neutral-400 py-2 px-3 text-sm bg-white dark:bg-neutral-800 dark:text-neutral-100 rounded-md shadow-sm" 
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