import { db } from "@/lib/db"
import { auth } from "@clerk/nextjs/server"
import { notFound, redirect } from "next/navigation"
import BoardNav from "../../../../components/dashboard/board/board-nav"

export async function generateMetadata({
    params
}: {
    params: { boardId: string }
}) {
    const { orgId } = auth()

    if (!orgId) {
        return {
            title: "Board"
        }
    }

    const board = await db.board.findUnique({
        where: {
            id: params.boardId,
            orgId
        }
    })

    return {
        title: board?.title || "Board"
    }
}

export default async function OrganizationIdLayout({ 
    children, params
}: { 
    children: React.ReactNode,
    params: { boardId: string }
}) {
    const { orgId } = auth()

    if(!orgId){
        redirect("/select-org")
    }
     
    const board = await db.board.findUnique({
        where: {
            id: params.boardId,
            orgId
        }
    })

    if(!board) {
        notFound()
    }

    return (
        <div
            className="relative h-full bg-no-repeat bg-cover bg-center"
            style={{backgroundImage: `url(${board.imageFullUrl})`}}
        >
            <BoardNav data={board}/>
            <div className="absolute inset-0 bg-black/15"/>
            <main className="relative py-28 h-full">
                {children}
            </main>
        </div>
    )
}