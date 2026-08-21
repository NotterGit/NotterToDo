import { db } from "@/lib/db"
import { auth } from "@clerk/nextjs/server"
import { notFound, redirect } from "next/navigation"
import BoardNav from "@/components/dashboard/board/board-nav"
import { pages } from "@/config/routing/pages.route"
import type { BoardIdPageProps } from "@/config/types/main.types"

export async function generateMetadata({
    params
}: BoardIdPageProps) {
    const { boardId } = await params
    const { userId, orgId: clerkOrgId } = await auth()
    const orgId = clerkOrgId || userId

    if (!orgId) {
        return {
            title: "Доска"
        }
    }

    const board = await db.board.findUnique({
        where: {
            id: boardId,
            orgId
        }
    })

    return {
        title: board?.title || "Доска"
    }
}

export default async function OrganizationIdLayout({ 
    children, params
}: { 
    children: React.ReactNode,
    params: Promise<{ boardId: string }>
}) {
    const { boardId } = await params
    const { userId, orgId: clerkOrgId } = await auth()
    const orgId = clerkOrgId || userId

    if(!orgId){
        redirect(pages.SELECT_ORG)
    }
     
    const board = await db.board.findUnique({
        where: {
            id: boardId,
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
            <main className="relative pt-28 h-full">
                {children}
            </main>
        </div>
    )
}