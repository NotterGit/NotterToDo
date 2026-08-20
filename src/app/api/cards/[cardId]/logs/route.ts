import { db } from "@/lib/db"
import { auth } from "@clerk/nextjs/server"
import { ENTITY_TYPE } from "@prisma/client"
import { NextResponse } from "next/server"
import { AUDIT_LOG_LIMIT } from "@/config/const/limits.const"

export async function GET(
  request: Request,
  { params }: { params: { cardId: string } }
) {
  try {
    const { userId, orgId } = auth()

    if (!userId || !orgId) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const auditLogs = await db.auditLog.findMany({
      where: {
        orgId,
        entityId: params.cardId,
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