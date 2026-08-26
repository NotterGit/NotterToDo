import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getUserById } from "@/api/user";
import { getOrgById } from "@/api/org";
import { isDiamondPlan } from "@/config/const/limits.const";
import { checkOrgAccess } from "@/lib/org-access";
import { format } from "date-fns";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ boardId: string }> }
) {
  try {
    const { boardId } = await params;
    const { userId, orgId: clerkOrgId } = await auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const board = await db.board.findUnique({
      where: {
        id: boardId,
      },
      include: {
        lists: {
          orderBy: {
            order: "asc",
          },
          include: {
            cards: {
              orderBy: {
                order: "asc",
              },
            },
          },
        },
      },
    });

    if (!board) {
      return new NextResponse("Board not found", { status: 404 });
    }

    const hasOrgAccess = await checkOrgAccess(board.orgId, userId, clerkOrgId);
    const hasAccess = board.public || hasOrgAccess;

    if (!hasAccess) {
      return new NextResponse("Forbidden", { status: 403 });
    }

    const orgId = board.orgId;
    const isOrg =
      orgId.startsWith("org_") || Boolean(clerkOrgId && clerkOrgId === orgId);
    const profile = isOrg ? await getOrgById(orgId) : await getUserById(orgId);

    if (!isDiamondPlan(profile?.premium)) {
      return new NextResponse(
        "Экспорт доски доступен только для тарифа Diamond",
        { status: 403 }
      );
    }

    const exportData = {
      version: 1,
      type: "notter_todo_board_export",
      exportedAt: new Date().toISOString(),
      board: {
        title: board.title,
        image: board.image,
        lists: board.lists.map((list) => ({
          title: list.title,
          order: list.order,
          cards: list.cards.map((card) => ({
            title: card.title,
            order: card.order,
            description: card.description || "",
          })),
        })),
      },
    };

    const dateStr = format(new Date(), "yyyy-MM-dd");
    const sanitizedTitle = board.title.replace(/[^a-zA-Z0-9а-яА-ЯёЁ_-]/g, "_");
    const filename = `notter-board-${sanitizedTitle}-${dateStr}.json`;

    return new NextResponse(JSON.stringify(exportData, null, 2), {
      status: 200,
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        "Content-Disposition": `attachment; filename="${encodeURIComponent(filename)}"`,
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    console.error("[BOARD_EXPORT_ERROR]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
