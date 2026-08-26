import { db } from "@/lib/db"
import { auth } from "@clerk/nextjs/server"
import { notFound, redirect } from "next/navigation"
import BoardNav from "@/components/dashboard/board/board-nav"
import { BoardBackground } from "@/components/dashboard/board/board-background"
import { OrgControl } from "@/components/dashboard/org-control"
import { pages } from "@/config/routing/pages.route"
import { checkOrgAccess } from "@/lib/org-access"
import type { BoardIdPageProps } from "@/config/types/main.types"

export async function generateMetadata({
    params
}: BoardIdPageProps) {
    const { boardId } = await params
    const { userId, orgId: clerkOrgId } = await auth()

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

    const isAuthorized = userId ? await checkOrgAccess(board.orgId, userId, clerkOrgId) : false
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

    const board = await db.board.findUnique({
        where: {
            id: boardId
        }
    })

    if (!board) {
        notFound()
    }

    const isOwner = userId ? await checkOrgAccess(board.orgId, userId, clerkOrgId) : false

    if (!isOwner && !board.public) {
        if (!userId) {
            redirect(pages.AUTH.SIGN_IN)
        }
        notFound()
    }

    return (
        <BoardBackground image={board.image}>
            <OrgControl orgId={board.orgId} />
            <BoardNav data={board} isReadOnly={!isOwner} />
            <main className="relative pt-28 h-full">
                {children}
            </main>
        </BoardBackground>
    )
}