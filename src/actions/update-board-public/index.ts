"use server"

import { auth } from "@clerk/nextjs/server";
import { InputType, ReturnType } from "./types"
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { createSafeAction } from "@/lib/create-safe-action";
import { UpdateBoardPublic } from "./schema";
import { createAuditLog } from "@/lib/audit-log";
import { ACTION, ENTITY_TYPE } from "@prisma/client";
import { pages } from "@/config/routing/pages.route";
import { getPlanLimits } from "@/config/const/limits.const";
import { getUserById } from "@/api/user";
import { getOrgById } from "@/api/org";
import { checkOrgAccess } from "@/lib/org-access";

const handler = async (data: InputType): Promise<ReturnType> => {
  const { userId, orgId: clerkOrgId } = await auth()

  if (!userId) {
    return {
      error: "Не авторизован"
    }
  }

  const { public: isPublic, id } = data

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
        error: "Недостаточно прав для изменения статуса доски"
      }
    }

    if (isPublic && !existingBoard.public) {
      const boardOrgId = existingBoard.orgId
      const isOrg = boardOrgId.startsWith("org_")
      const profile = isOrg ? await getOrgById(boardOrgId) : await getUserById(boardOrgId)
      const planLimits = getPlanLimits(profile?.premium, isOrg)

      const publicCount = await db.board.count({
        where: {
          orgId: boardOrgId,
          public: true,
        },
      })

      if (publicCount >= planLimits.publicBoards) {
        return {
          error: `Достигнут лимит публичных досок (${planLimits.publicBoards})`
        }
      }
    }

    board = await db.board.update({
      where: {
        id
      },
      data: {
        public: isPublic
      }
    })

    await createAuditLog({
      entityId: board.id,
      entityTitle: board.title,
      entityType: ENTITY_TYPE.BOARD,
      action: ACTION.UPDATE,
      orgId: existingBoard.orgId,
    })
  } catch (error) {
    console.error("[UPDATE_BOARD_PUBLIC_ERROR]", error)
    return {
      error: "Не удалось обновить статус"
    }
  }

  revalidatePath(pages.BOARD(id))
  revalidatePath(pages.DASHBOARD(board.orgId))
  return { data: board }
}

export const updateBoardPublic = createSafeAction(UpdateBoardPublic, handler)