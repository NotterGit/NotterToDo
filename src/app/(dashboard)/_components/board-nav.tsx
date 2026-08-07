import { Board } from "@prisma/client"
import { BoardTitle } from "./board-title"
import BoardOptions from "./board-options"

interface BoardNavProps {
    data: Board
}

export default async function BoardNav({
    data
}: BoardNavProps) {
    return (
        <nav className="w-full h-14 z-[40] bg-black/50 fixed top-14 flex items-center px-6 gap-x-4 text-white">
            <BoardTitle data={data}/>
            <div className="ml-auto">
                <BoardOptions id={data.id}/>
            </div>
        </nav>
    )
}
