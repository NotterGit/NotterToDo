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

import { defaultImages } from "@/config/const/banner-images.const"

const handler = async (data: InputType): Promise<ReturnType> => {
    const { userId, orgId: clerkOrgId } = await auth()
    const orgId = clerkOrgId || userId

    if (!userId || !orgId) {
        return {
            error: "Не авторизован"
        }
    }

    const { id, image } = data

    let imageId = ""
    let imageThumbUrl = ""
    let imageFullUrl = ""
    let imageLinkHtml = ""
    let imageUserName = ""

    if (image && image.includes("|")) {
        const parts = image.split("|")
        imageId = parts[0]
        imageThumbUrl = parts[1]
        imageFullUrl = parts[2]
        imageLinkHtml = parts[3]
        imageUserName = parts[4]
    } else if (image) {
        const stub = defaultImages.find((img) => img.id === image)
        if (stub) {
            imageId = stub.id
            imageThumbUrl = stub.urls.thumb
            imageFullUrl = stub.urls.full
            imageLinkHtml = stub.links.html
            imageUserName = stub.user.name
        }
    }

    if (!imageId || !imageThumbUrl || !imageFullUrl || !imageLinkHtml || !imageUserName) {
        const fallback = defaultImages[0]
        imageId = fallback.id
        imageThumbUrl = fallback.urls.thumb
        imageFullUrl = fallback.urls.full
        imageLinkHtml = fallback.links.html
        imageUserName = fallback.user.name
    }

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
