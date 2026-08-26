"use server"

import { auth } from "@clerk/nextjs/server";
import { InputType, ReturnType } from "./types"
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { createSafeAction } from "@/lib/create-safe-action";
import { UpdateCardOrder } from "./schema";
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

  const { items, boardId } = data

  let cards

  try {
    const board = await db.board.findUnique({
      where: { id: boardId }
    })

    if (!board) {
      return {
        error: "Доска не найдена"
      }
    }

    const hasAccess = await checkOrgAccess(board.orgId, userId, clerkOrgId)
    if (!hasAccess) {
      return {
        error: "Недостаточно прав"
      }
    }

    const transaction = items.map((card) =>
      db.card.update({
        where: {
          id: card.id,
        },
        data: {
          order: card.order,
          listId: card.listId
        }
      })
    )

    cards = await db.$transaction(transaction)

    await createAuditLog({
      entityTitle: board.title,
      entityId: board.id,
      entityType: ENTITY_TYPE.BOARD,
      action: ACTION.UPDATE,
      orgId: board.orgId,
    })
  } catch {
    return {
        error: "Не удалось переместить"
    }
  }

  revalidatePath(pages.BOARD(boardId))
  return {data: cards}
}

export const updateCardOrder = createSafeAction(UpdateCardOrder, handler)