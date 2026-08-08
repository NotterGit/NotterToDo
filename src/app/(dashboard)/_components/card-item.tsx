"use client"

import { Card } from "@prisma/client"
import { Draggable } from "@hello-pangea/dnd"

interface CardItemProps {
    data: Card
    index: number
}

export function CardItem({
    data, index
}: CardItemProps) {
    return (
        <Draggable draggableId={data.id} index={index}>
            {(provided) => (
                <div 
                    className="truncate border-2 border-transparent hover:border-black py-2 px-3 text-sm bg-white rounded-md shadow-sm" 
                    role="button"
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