"use server"

import { auth } from "@clerk/nextjs/server";
import { InputType, ReturnType } from "./types"
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { createSafeAction } from "@/lib/create-safe-action";
import { CopyCard } from "./schema";
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
    const cardToCopy = await db.card.findUnique({
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

    if (!cardToCopy) {
      return { error: "Карточка не найдена" }
    }

    const hasAccess = await checkOrgAccess(cardToCopy.list.board.orgId, userId, clerkOrgId)
    if (!hasAccess) {
      return { error: "Недостаточно прав" }
    }

    const lastCard = await db.card.findFirst({
      where: { listId: cardToCopy.listId },
      orderBy: { order: "desc" },
      select: { order: true }
    })

    const newOrder = lastCard ? lastCard.order + 1 : 1

    card = await db.card.create({
      data: {
        title: `${cardToCopy.title} - Копия`,
        description: cardToCopy.description,
        order: newOrder,
        listId: cardToCopy.listId
      }
    })

    await createAuditLog({
      entityId: card.id,
      entityTitle: card.title,
      entityType: ENTITY_TYPE.CARD,
      action: ACTION.CREATE,
      orgId: cardToCopy.list.board.orgId,
    })
  } catch {
    return {
        error: "Не удалось скопировать"
    }
  }

  revalidatePath(pages.BOARD(boardId))
  return {data: card}
}

export const copyCard = createSafeAction(CopyCard, handler)