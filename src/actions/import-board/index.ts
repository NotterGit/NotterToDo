"use server";

import { auth } from "@clerk/nextjs/server";
import { InputType, ReturnType } from "./types";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { createSafeAction } from "@/lib/create-safe-action";
import { ImportBoard } from "./schema";
import { createAuditLog } from "@/lib/audit-log";
import { ACTION, ENTITY_TYPE } from "@prisma/client";
import { pages } from "@/config/routing/pages.route";
import { defaultBgImage } from "@/config/const/banner-images.const";
import { getPlanLimits, isDiamondPlan } from "@/config/const/limits.const";
import { getUserById } from "@/api/user";
import { getOrgById } from "@/api/org";

const handler = async (data: InputType): Promise<ReturnType> => {
  const { userId, orgId: clerkOrgId } = await auth();
  const orgId = clerkOrgId || userId;

  if (!userId || !orgId) {
    return {
      error: "Не авторизован",
    };
  }

  const { title, image, lists } = data;
  const boardImage = image || defaultBgImage;

  let board;

  try {
    const isOrg =
      orgId.startsWith("org_") || Boolean(clerkOrgId && clerkOrgId === orgId);
    const profile = isOrg ? await getOrgById(orgId) : await getUserById(orgId);

    if (!isDiamondPlan(profile?.premium)) {
      return {
        error: "Импорт досок доступен только для тарифа Diamond",
      };
    }

    const planLimits = getPlanLimits(profile?.premium, isOrg);

    const count = await db.board.count({
      where: {
        orgId,
      },
    });

    if (!planLimits.isUnlimitedBoards && count >= planLimits.boards) {
      return {
        error: `Достигнут лимит досок (${planLimits.boards})`,
      };
    }

    board = await db.board.create({
      data: {
        title,
        orgId,
        image: boardImage,
        lists: {
          create: (lists || []).map((list, listIndex) => ({
            title: list.title,
            order: typeof list.order === "number" ? list.order : listIndex + 1,
            color: list.color || null,
            cards: {
              create: (list.cards || []).map((card, cardIndex) => ({
                title: card.title,
                order:
                  typeof card.order === "number" ? card.order : cardIndex + 1,
                description: card.description || "",
                color: card.color || null,
              })),
            },
          })),
        },
      },
    });

    await createAuditLog({
      entityId: board.id,
      entityTitle: board.title,
      entityType: ENTITY_TYPE.BOARD,
      action: ACTION.CREATE,
    });
  } catch (err) {
    console.error("[IMPORT_BOARD_ERROR]", err);
    return {
      error: "Не удалось импортировать доску",
    };
  }

  revalidatePath(pages.BOARD(board.id));
  revalidatePath(pages.DASHBOARD(orgId));
  return { data: board };
};

export const importBoard = createSafeAction(ImportBoard, handler);
