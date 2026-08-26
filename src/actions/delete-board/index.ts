"use server"

import { auth } from "@clerk/nextjs/server";
import { InputType, ReturnType } from "./types"
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { createSafeAction } from "@/lib/create-safe-action";
import { DeleteBoard } from "./schema";
import { ACTION, ENTITY_TYPE } from "@prisma/client";
import { createAuditLog } from "@/lib/audit-log";
import { pages } from "@/config/routing/pages.route";
import { checkOrgAccess, checkOrgAdmin } from "@/lib/org-access";

const handler = async (data: InputType): Promise<ReturnType> => {
  const { userId, orgId: clerkOrgId, orgRole } = await auth()

  if (!userId) {
    return {
      error: "Не авторизован"
    }
  }

  const { id } = data
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

    const hasAccess = await checkOrgAccess(existingBoard.orgId, userId, clerkOrgId)
    if (!hasAccess) {
      return {
        error: "Недостаточно прав"
      }
    }

    if (existingBoard.orgId.startsWith("org_")) {
      const isOrgAdmin = await checkOrgAdmin(existingBoard.orgId, userId, orgRole, clerkOrgId)
      if (!isOrgAdmin) {
        return {
          error: "Удаление доски доступно только администраторам организации"
        }
      }
    }

    board = await db.board.delete({
        where: {
            id,
        }
    })

    await createAuditLog({
      entityId: board.id,
      entityTitle: board.title,
      entityType: ENTITY_TYPE.BOARD,
      action: ACTION.DELETE,
      orgId: existingBoard.orgId,
    })

    revalidatePath(pages.DASHBOARD(existingBoard.orgId))
  } catch {
    return {
        error: "Не удалось удалить"
    }
  }

  return { data: board }
}

export const deleteBoard = createSafeAction(DeleteBoard, handler)