import { BoardTitle } from "./board-title"
import BoardOptions from "./board-options"
import type { BoardNavProps } from "@/config/types/main.types"
import { Eye, Globe, Lock } from "lucide-react"

export default async function BoardNav({
    data,
    isReadOnly = false
}: BoardNavProps) {
    return (
        <nav className="w-full h-14 z-[40] bg-black/40 backdrop-blur-xl border-b border-white/10 fixed top-14 flex items-center px-6 gap-x-3 text-white shadow-sm">
            <BoardTitle data={data} isReadOnly={isReadOnly} />
            <div className="flex items-center">
                {isReadOnly ? (
                    <span className="inline-flex items-center gap-x-1.5 text-xs font-semibold bg-white/15 text-white/90 border border-white/20 rounded-xl px-3 py-1 select-none backdrop-blur-md">
                        <Eye className="h-3.5 w-3.5" />
                        Только просмотр
                    </span>
                ) : data.public ? (
                    <span className="inline-flex items-center gap-x-1.5 text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-xl px-3 py-1 select-none backdrop-blur-md">
                        <Globe className="h-3.5 w-3.5" />
                        Публичная
                    </span>
                ) : (
                    <span className="inline-flex items-center gap-x-1.5 text-xs font-semibold bg-white/10 text-white/80 border border-white/15 rounded-xl px-3 py-1 select-none backdrop-blur-md">
                        <Lock className="h-3.5 w-3.5" />
                        Приватная
                    </span>
                )}
            </div>
            {!isReadOnly && (
                <div className="ml-auto">
                    <BoardOptions
                        id={data.id}
                        initialPublic={data.public}
                        initialImage={data.image}
                        data={data}
                    />
                </div>
            )}
        </nav>
    )
}
