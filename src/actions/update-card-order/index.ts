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

const handler = async (data: InputType): Promise<ReturnType> => {
  const { userId, orgId } = auth()

  if (!userId || !orgId) {
    return {
      error: "Unauthorized"
    }
  }

  const { items, boardId } = data

  let cards

  try {
    const transaction = items.map((card) =>
      db.card.update({
        where: {
          id: card.id,
          list: {
            board: {
              orgId
            }
          }
        },
        data: {
          order: card.order,
          listId: card.listId
        }
      })
    )

    cards = await db.$transaction(transaction)

    const board = await db.board.findUnique({
      where: { id: boardId, orgId }
    })

    if (board) {
      await createAuditLog({
        entityTitle: board.title,
        entityId: board.id,
        entityType: ENTITY_TYPE.BOARD,
        action: ACTION.UPDATE
      })
    }
  } catch {
    return {
        error: "Failed to reorder"
    }
  }

  revalidatePath(pages.BOARD(boardId))
  return {data: cards}
}

export const updateCardOrder = createSafeAction(UpdateCardOrder, handler)