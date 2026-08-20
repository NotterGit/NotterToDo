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

const handler = async (data: InputType): Promise<ReturnType> => {
    const { userId, orgId } = auth()

    if(!userId || !orgId) {
        return {
            error: "Unauthorized"
        }
    }

    const { title, image } = data

    const [
        imageId,
        imageThumbUrl,
        imageFullUrl,
        imageLinkHtml,
        imageUserName
    ] = image.split("|")

    console.log(
        imageId,
        imageThumbUrl,
        imageFullUrl,
        imageLinkHtml,
        imageUserName
    )

    if(!imageId || !imageThumbUrl || !imageFullUrl || !imageLinkHtml || !imageUserName) {
        return {
            error: "missing fields"
        }
    }

    let board

    try {
        board = await db.board.create({
            data: {
                title,
                orgId,
                imageId,
                imageThumbUrl,
                imageFullUrl,
                imageLinkHtml,
                imageUserName
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
            error: "Failed to create"
        }
    }

    revalidatePath(pages.BOARD(board.id))
    return { data: board }
}

export const createBoard = createSafeAction(CreateBoard, handler)