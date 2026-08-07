"use client"

import { ListWithCards } from "@/types"
import { ListHeader } from "./list-header"

interface ListItemProps {
    data: ListWithCards
    index: number
}

export function ListItem({
    data, index
}: ListItemProps) {
    return (
        <li className="shrink-0 h-full w-[272px] select-none">
            <div className="w-full rounded-md bg-[#f1f2f4] shadow-sm pb-2">
                <ListHeader data={data}/>
            </div>
        </li>
    )
}