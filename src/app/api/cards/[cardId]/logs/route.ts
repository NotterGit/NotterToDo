import { db } from "@/lib/db"
import { auth } from "@clerk/nextjs/server"
import { ENTITY_TYPE } from "@prisma/client"
import { NextResponse } from "next/server"
import { AUDIT_LOG_LIMIT } from "@/config/const/limits.const"

export async function GET(
  request: Request,
  { params }: { params: Promise<{ cardId: string }> }
) {
  try {
    const { cardId } = await params
    const { userId, orgId: clerkOrgId } = await auth()
    const orgId = clerkOrgId || userId

    const card = await db.card.findUnique({
      where: {
        id: cardId
      },
      include: {
        list: {
          select: {
            board: {
              select: {
                orgId: true,
                public: true
              }
            }
          }
        }
      }
    })

    if (!card) {
      return new NextResponse("Card not found", { status: 404 })
    }

    const canView =
      (orgId && card.list.board.orgId === orgId) ||
      (userId && card.list.board.orgId === userId) ||
      (clerkOrgId && card.list.board.orgId === clerkOrgId) ||
      card.list.board.public

    if (!canView) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const auditLogs = await db.auditLog.findMany({
      where: {
        orgId: card.list.board.orgId,
        entityId: cardId,
        entityType: ENTITY_TYPE.CARD
      },
      orderBy: {
        createdAt: "desc"
      },
      take: AUDIT_LOG_LIMIT
    })

    return NextResponse.json(auditLogs)
  } catch {
    return new NextResponse("Internal Error", { status: 500 })
  }
}