"use server"

import { auth } from "@clerk/nextjs/server";
import { InputType, ReturnType } from "./types"
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { createSafeAction } from "@/lib/create-safe-action";
import { DeleteBoard } from "./schema";
import { redirect } from "next/navigation";
import { ACTION, ENTITY_TYPE } from "@prisma/client";
import { createAuditLog } from "@/lib/audit-log";
import { pages } from "@/config/routing/pages.route";

const handler = async (data: InputType): Promise<ReturnType> => {
  const { userId, orgId: clerkOrgId } = await auth()
  const orgId = clerkOrgId || userId

  if (!userId || !orgId) {
    return {
      error: "Не авторизован"
    }
  }

  const { id } = data

  try {
    const board = await db.board.delete({
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

  revalidatePath(pages.ORGANIZATION(orgId))
  redirect(pages.ORGANIZATION(orgId))
}

export const deleteBoard = createSafeAction(DeleteBoard, handler)