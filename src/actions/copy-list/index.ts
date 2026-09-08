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
import { checkOrgAccess } from "@/lib/org-access";

const handler = async (data: InputType): Promise<ReturnType> => {
  const { userId, orgId: clerkOrgId } = await auth()

  if (!userId) {
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
      },
      include: {
        cards: true,
        board: true,
      }
    })

    if (!listToCopy) {
      return { error: "Список не найден" }
    }

    const hasAccess = await checkOrgAccess(listToCopy.board.orgId, userId, clerkOrgId)
    if (!hasAccess) {
      return { error: "Недостаточно прав" }
    }
    
    const lastList = await db.list.findFirst({
      where: { boardId: boardId },
      orderBy: { order: "desc" },
      select: { order: true }
    })

    const newOrder = lastList ? lastList.order + 1 : 1

    list = await db.list.create({
        data: {
            boardId: listToCopy.boardId,
            title: `${listToCopy.title} - Копия`,
            order: newOrder,
            color: listToCopy.color,
            cards: {
              createMany: {
                data: listToCopy.cards.map((card) => ({
                  title: card.title,
                  description: card.description,
                  order: card.order,
                  color: card.color
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
      action: ACTION.CREATE,
      orgId: listToCopy.board.orgId,
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