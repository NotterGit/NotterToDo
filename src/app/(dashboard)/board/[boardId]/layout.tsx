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

    const board = await db.board.findUnique({
        where: {
            id: boardId
        }
    })

    if (!board) {
        return {
            title: "Доска"
        }
    }

    const isAuthorized = !!(
        (orgId && board.orgId === orgId) ||
        (userId && board.orgId === userId) ||
        (clerkOrgId && board.orgId === clerkOrgId)
    )
    if (!isAuthorized && !board.public) {
        return {
            title: "Доска"
        }
    }

    return {
        title: board.title || "Доска"
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

    const board = await db.board.findUnique({
        where: {
            id: boardId
        }
    })

    if(!board) {
        notFound()
    }

    const isOwner = !!(
        (orgId && board.orgId === orgId) ||
        (userId && board.orgId === userId) ||
        (clerkOrgId && board.orgId === clerkOrgId)
    )

    if (!isOwner && !board.public) {
        if (!orgId) {
            redirect(pages.AUTH.SIGN_IN)
        }
        notFound()
    }

    return (
        <div
            className="relative h-full bg-no-repeat bg-cover bg-center"
            style={{backgroundImage: `url(${board.imageFullUrl})`}}
        >
            <BoardNav data={board} isReadOnly={!isOwner} />
            <div className="absolute inset-0 bg-black/15"/>
            <main className="relative pt-28 h-full">
                {children}
            </main>
        </div>
    )
}