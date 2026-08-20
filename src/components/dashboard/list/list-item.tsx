"use client"

import { ListHeader } from "./list-header"
import { ElementRef, useRef, useState } from "react"
import { CardForm } from "../card/card-form"
import { cn } from "@/lib/utils"
import { CardItem } from "../card/card-item"
import { Draggable, Droppable } from "@hello-pangea/dnd"
import type { ListItemProps } from "@/config/types/main.types"

export function ListItem({
    data, index
}: ListItemProps) {
    const textareaRef = useRef<ElementRef<"textarea">>(null)

    const [isEditing, setIsEditing] = useState(false)

    const disableEditing = () => {
        setIsEditing(false)
    }

    const enableEditing = () => {
        setIsEditing(true)
        setTimeout(() => {
            textareaRef.current?.focus()
        })
    }

    return (
        <Draggable draggableId={data.id} index={index}>
            {(provided) => (
                <li 
                    {...provided.draggableProps}
                    ref={provided.innerRef}
                    className="shrink-0 h-full w-[272px] select-none"
                >
                    <div 
                        {...provided.dragHandleProps}
                        className="w-full max-h-full rounded-md bg-[#f1f2f4] shadow-sm pb-2 flex flex-col"
                    >
                        <ListHeader data={data} onAddCard={enableEditing}/>
                        <Droppable droppableId={data.id} type="card">
                            {(provided) => (
                                <ol
                                    ref={provided.innerRef}
                                    {...provided.droppableProps}
                                    className={cn(
                                        "mx-1 px-1 py-0.5 flex flex-col gap-y-2 overflow-y-auto overflow-x-hidden flex-1 min-h-0",
                                        data.cards.length > 0 ? "mt-2" : "mt-0",
                                    )}
                                >
                                    {data.cards.map((card, index) => (
                                        <CardItem
                                            index={index}
                                            key={card.id}
                                            data={card}
                                        />
                                    ))}
                                    {provided.placeholder}
                                </ol>
                            )}
                        </Droppable>
                        <CardForm 
                            ref={textareaRef} 
                            isEditing={isEditing}
                            enableEditing={enableEditing}
                            disableEditing={disableEditing}
                            listId={data.id}
                        />
                    </div>
                </li>
            )}
        </Draggable>
    )
}