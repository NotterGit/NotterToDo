"use server"

import { auth } from "@clerk/nextjs/server"
import { InputType, ReturnType } from "./types"
import { db } from "@/lib/db"
import { revalidatePath } from "next/cache"
import { createSafeAction } from "@/lib/create-safe-action"
import { UpdateBoardBackground } from "./schema"
import { createAuditLog } from "@/lib/audit-log"
import { ACTION, ENTITY_TYPE } from "@prisma/client"
import { pages } from "@/config/routing/pages.route"

const handler = async (data: InputType): Promise<ReturnType> => {
    const { userId, orgId: clerkOrgId } = await auth()
    const orgId = clerkOrgId || userId

    if (!userId || !orgId) {
        return {
            error: "Не авторизован"
        }
    }

    const { id, image } = data

    let board

    try {
        const existingBoard = await db.board.findUnique({
            where: { id }
        })

        if (!existingBoard) {
            return {
                error: "Доска не найдена"
            }
        }

        const hasAccess =
            existingBoard.orgId === orgId ||
            existingBoard.orgId === clerkOrgId ||
            existingBoard.orgId === userId

        if (!hasAccess) {
            return {
                error: "Недостаточно прав для изменения доски"
            }
        }

        board = await db.board.update({
            where: { id },
            data: {
                image
            }
        })

        await createAuditLog({
            entityId: board.id,
            entityTitle: board.title,
            entityType: ENTITY_TYPE.BOARD,
            action: ACTION.UPDATE
        })
    } catch (error) {
        console.error("[UPDATE_BOARD_BACKGROUND_ERROR]", error)
        return {
            error: "Не удалось обновить фон"
        }
    }

    revalidatePath(pages.BOARD(id))
    return { data: board }
}

export const updateBoardBackground = createSafeAction(UpdateBoardBackground, handler)
