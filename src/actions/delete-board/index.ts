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

const handler = async (data: InputType): Promise<ReturnType> => {
  const { userId, orgId: clerkOrgId, orgRole } = await auth()
  const orgId = clerkOrgId || userId

  if (!userId || !orgId) {
    return {
      error: "Не авторизован"
    }
  }

  const isOrgAdmin =
    orgRole === "org:admin" ||
    orgRole === "admin" ||
    (typeof orgRole === "string" && orgRole.includes("admin"))

  if (clerkOrgId && !isOrgAdmin) {
    return {
      error: "Удаление доски доступно только администраторам организации"
    }
  }

  const { id } = data
  let board

  try {
    board = await db.board.delete({
        where: {
            id,
            orgId
        }
    })

    await createAuditLog({
      entityId: board.id,
      entityTitle: board.title,
      entityType: ENTITY_TYPE.BOARD,
      action: ACTION.DELETE
    })
  } catch {
    return {
        error: "Не удалось удалить"
    }
  }

  revalidatePath(pages.DASHBOARD(orgId))
  return { data: board }
}

export const deleteBoard = createSafeAction(DeleteBoard, handler)