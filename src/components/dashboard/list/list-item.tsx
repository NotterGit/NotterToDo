"use client"

import { ListHeader } from "./list-header"
import { ElementRef, useRef, useState } from "react"
import { CardForm } from "../card/card-form"
import { cn } from "@/lib/utils"
import { CardItem } from "../card/card-item"
import { Draggable, Droppable } from "@hello-pangea/dnd"
import type { ListItemProps } from "@/config/types/main.types"

export function ListItem({
    data, index, isReadOnly = false, isWrapped = false
}: ListItemProps) {
    const textareaRef = useRef<ElementRef<"textarea">>(null)

    const [isEditing, setIsEditing] = useState(false)

    const disableEditing = () => {
        setIsEditing(false)
    }

    const enableEditing = () => {
        if (isReadOnly) return
        setIsEditing(true)
        setTimeout(() => {
            textareaRef.current?.focus()
        })
    }

    return (
        <Draggable draggableId={data.id} index={index} isDragDisabled={isReadOnly}>
            {(provided) => (
                <li 
                    {...provided.draggableProps}
                    ref={provided.innerRef}
                    className={cn(
                        "shrink-0 w-[272px] select-none",
                        !isWrapped && "h-full"
                    )}
                >
                    <div 
                        {...provided.dragHandleProps}
                        className={cn(
                            "w-full rounded-2xl bg-[#f1f2f4]/95 dark:bg-zinc-950/95 border border-white/60 dark:border-white/10 shadow-xl pb-2 flex flex-col",
                            isWrapped ? "max-h-[75vh]" : "max-h-full"
                        )}
                    >
                        <ListHeader data={data} onAddCard={enableEditing} isReadOnly={isReadOnly}/>
                        <Droppable droppableId={data.id} type="card" isDropDisabled={isReadOnly}>
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
                                            isReadOnly={isReadOnly}
                                        />
                                    ))}
                                    {provided.placeholder}
                                </ol>
                            )}
                        </Droppable>
                        {!isReadOnly && (
                            <CardForm 
                                ref={textareaRef} 
                                isEditing={isEditing}
                                enableEditing={enableEditing}
                                disableEditing={disableEditing}
                                listId={data.id}
                            />
                        )}
                    </div>
                </li>
            )}
        </Draggable>
    )
}