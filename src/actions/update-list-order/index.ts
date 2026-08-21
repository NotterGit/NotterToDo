"use server"

import { auth } from "@clerk/nextjs/server";
import { InputType, ReturnType } from "./types"
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { createSafeAction } from "@/lib/create-safe-action";
import { UpdateListOrder } from "./schema";
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

  const { items, boardId } = data

  let lists

  try {
    const transaction = items.map((list) =>
      db.list.update({
        where: {
          id: list.id,
          board: {
            orgId
          }
        },
        data: {
          order: list.order
        }
      })
    )

    lists = await db.$transaction(transaction)

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
        error: "Не удалось переместить"
    }
  }

  revalidatePath(pages.BOARD(boardId))
  return {data: lists}
}

export const updateListOrder = createSafeAction(UpdateListOrder, handler)