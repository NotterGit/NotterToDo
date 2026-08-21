"use server"

import { auth } from "@clerk/nextjs/server";
import { InputType, ReturnType } from "./types"
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { createSafeAction } from "@/lib/create-safe-action";
import { CopyList } from "./schema";
import { createAuditLog } from "@/lib/audit-log";
import { ACTION, ENTITY_TYPE } from "@prisma/client";
import { pages } from "@/config/routing/pages.route";

const handler = async (data: InputType): Promise<ReturnType> => {
  const { userId, orgId: clerkOrgId } = await auth()
  const orgId = clerkOrgId || userId

  if (!userId || !orgId) {
    return {
      error: "Не авторизован"
    }
  }

  const { id, boardId } = data
  let list

  try {
    const listToCopy = await db.list.findUnique({
      where: {
        id,
        boardId,
        board: {
          orgId,
        }
      },
      include: {
        cards: true
      }
    })

    if (!listToCopy) {
      return { error: "Список не найден" }
    }
    
    const lastList = await db.list.findFirst({
      where: {boardId: boardId},
      orderBy: {order: "desc"},
      select: {order: true}
    })

    const newOrder = lastList ? lastList.order + 1 : 1

    list = await db.list.create({
        data: {
            boardId: listToCopy.boardId,
            title: `${listToCopy.title} - Копия`,
            order: newOrder,
            cards: {
              createMany: {
                data: listToCopy.cards.map((card) => ({
                  title: card.title,
                  description: card.description,
                  order: card.order
                }))
              }
            }
        },
        include: {
          cards: true
        }
    })

    await createAuditLog({
      entityId: list.id,
      entityTitle: list.title,
      entityType: ENTITY_TYPE.LIST,
      action: ACTION.CREATE
    })
  } catch {
    return {
        error: "Не удалось скопировать"
    }
  }

  revalidatePath(pages.BOARD(boardId))
  return {data: list}
}

export const copyList = createSafeAction(CopyList, handler)