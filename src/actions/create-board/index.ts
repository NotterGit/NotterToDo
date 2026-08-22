"use server"

import { auth } from "@clerk/nextjs/server"
import { InputType, ReturnType } from "./types"
import { db } from "@/lib/db"
import { revalidatePath } from "next/cache"
import { createSafeAction } from "@/lib/create-safe-action"
import { CreateBoard } from "./schema"
import { createAuditLog } from "@/lib/audit-log"
import { ACTION, ENTITY_TYPE } from "@prisma/client"
import { pages } from "@/config/routing/pages.route"
import { defaultBgImage } from "@/config/const/banner-images.const"

const handler = async (data: InputType): Promise<ReturnType> => {
    const { userId, orgId: clerkOrgId } = await auth()
    const orgId = clerkOrgId || userId

    if (!userId || !orgId) {
        return {
            error: "Не авторизован"
        }
    }

    const { title, image } = data
    const boardImage = image || defaultBgImage

    let board

    try {
        board = await db.board.create({
            data: {
                title,
                orgId,
                image: boardImage
            }
        })

        await createAuditLog({
            entityId: board.id,
            entityTitle: board.title,
            entityType: ENTITY_TYPE.BOARD,
            action: ACTION.CREATE
        })
    } catch (err) {
        console.error(err)
        return {
            error: "Не удалось создать"
        }
    }

    revalidatePath(pages.BOARD(board.id))
    return { data: board }
}

export const createBoard = createSafeAction(CreateBoard, handler)