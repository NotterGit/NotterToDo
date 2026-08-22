import { BoardTitle } from "./board-title"
import BoardOptions from "./board-options"
import type { BoardNavProps } from "@/config/types/main.types"
import { Eye, Globe, Lock } from "lucide-react"

export default async function BoardNav({
    data,
    isReadOnly = false
}: BoardNavProps) {
    return (
        <nav className="w-full h-14 z-[40] bg-black/50 fixed top-14 flex items-center px-6 gap-x-3 text-white">
            <BoardTitle data={data} isReadOnly={isReadOnly} />
            <div className="flex items-center">
                {isReadOnly ? (
                    <span className="inline-flex items-center gap-x-1 text-xs font-medium bg-white/20 text-white rounded-full px-2.5 py-0.5 select-none">
                        <Eye className="h-3 w-3" />
                        Только просмотр
                    </span>
                ) : data.public ? (
                    <span className="inline-flex items-center gap-x-1 text-xs font-medium bg-emerald-500/25 text-emerald-300 border border-emerald-500/30 rounded-full px-2.5 py-0.5 select-none">
                        <Globe className="h-3 w-3" />
                        Публичная
                    </span>
                ) : (
                    <span className="inline-flex items-center gap-x-1 text-xs font-medium bg-white/10 text-white/70 rounded-full px-2.5 py-0.5 select-none">
                        <Lock className="h-3 w-3" />
                        Приватная
                    </span>
                )}
            </div>
            {!isReadOnly && (
                <div className="ml-auto">
                    <BoardOptions
                        id={data.id}
                        initialPublic={data.public}
                        initialImageId={data.imageId}
                        data={data}
                    />
                </div>
            )}
        </nav>
    )
}
