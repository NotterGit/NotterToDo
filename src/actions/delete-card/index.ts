"use server"

import { auth } from "@clerk/nextjs/server";
import { InputType, ReturnType } from "./types"
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { createSafeAction } from "@/lib/create-safe-action";
import { DeleteCard } from "./schema";
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
  let card

  try {
    const existingCard = await db.card.findUnique({
      where: {
        id,
      },
      include: {
        list: {
          include: {
            board: true,
          }
        }
      }
    })

    if (!existingCard) {
      return {
        error: "Карточка не найдена"
      }
    }

    const hasAccess = await checkOrgAccess(existingCard.list.board.orgId, userId, clerkOrgId)
    if (!hasAccess) {
      return {
        error: "Недостаточно прав"
      }
    }

    card = await db.card.delete({
      where: {
        id,
      }
    })

    await createAuditLog({
      entityId: card.id,
      entityTitle: card.title,
      entityType: ENTITY_TYPE.CARD,
      action: ACTION.DELETE,
      orgId: existingCard.list.board.orgId,
    })
  } catch {
    return {
        error: "Не удалось удалить"
    }
  }

  revalidatePath(pages.BOARD(boardId))
  return {data: card}
}

export const deleteCard = createSafeAction(DeleteCard, handler)