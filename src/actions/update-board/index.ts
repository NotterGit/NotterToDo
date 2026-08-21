"use server"

import { auth } from "@clerk/nextjs/server";
import { InputType, ReturnType } from "./types"
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { createSafeAction } from "@/lib/create-safe-action";
import { UpdateBoard } from "./schema";
import { createAuditLog } from "@/lib/audit-log";
import { ACTION, ENTITY_TYPE } from "@prisma/client";
import { pages } from "@/config/routing/pages.route";

const handler = async (data: InputType): Promise<ReturnType> => {
  const { userId, orgId } = await auth()

  if (!userId || !orgId) {
    return {
      error: "Не авторизован"
    }
  }

  const { title, id } = data

  let board

  try {
    board = await db.board.update({
        where: {
            id,
            orgId
        },
        data: {
            title
        }
    })

    await createAuditLog({
      entityId: board.id,
      entityTitle: board.title,
      entityType: ENTITY_TYPE.BOARD,
      action: ACTION.UPDATE
    })
  } catch {
    return {
        error: "Не удалось обновить"
    }
  }

  revalidatePath(pages.BOARD(id))
  return {data: board}
}

export const updateBoard = createSafeAction(UpdateBoard, handler)