"use server"

import { auth } from "@clerk/nextjs/server";
import { InputType, ReturnType } from "./types"
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { createSafeAction } from "@/lib/create-safe-action";
import { DeleteList } from "./schema";
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
    const existingList = await db.list.findUnique({
      where: {
        id,
        boardId,
      },
      include: {
        board: true,
      }
    })

    if (!existingList) {
      return {
        error: "Список не найден"
      }
    }

    const hasAccess = await checkOrgAccess(existingList.board.orgId, userId, clerkOrgId)
    if (!hasAccess) {
      return {
        error: "Недостаточно прав"
      }
    }

    list = await db.list.delete({
        where: {
            id,
            boardId,
        },
    })

    await createAuditLog({
      entityId: list.id,
      entityTitle: list.title,
      entityType: ENTITY_TYPE.LIST,
      action: ACTION.DELETE,
      orgId: existingList.board.orgId,
    })
  } catch {
    return {
        error: "Не удалось удалить"
    }
  }

  revalidatePath(pages.BOARD(boardId))
  return {data: list}
}

export const deleteList = createSafeAction(DeleteList, handler)