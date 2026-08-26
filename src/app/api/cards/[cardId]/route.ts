import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { checkOrgAccess } from "@/lib/org-access";

export async function GET(
    req: Request,
    { params }: { params: Promise<{ cardId: string }> }
) {
    try {
        const { cardId } = await params
        const { userId, orgId: clerkOrgId } = await auth()

        const card = await db.card.findUnique({
            where: {
                id: cardId,
            },
            include: {
                list: {
                    select: {
                        title: true,
                        board: {
                            select: {
                                orgId: true,
                                public: true,
                            }
                        }
                    }
                }
            }
        })

        if (!card) {
            return new NextResponse("Card not found", { status: 404 })
        }

        const canEdit = userId ? await checkOrgAccess(card.list.board.orgId, userId, clerkOrgId) : false

        if (!canEdit && !card.list.board.public) {
            return new NextResponse("Unauthorized", { status: 401 })
        }

        return NextResponse.json({
            ...card,
            canEdit,
        })
    } catch {
        return new NextResponse("Internal Error", { status: 500 })
    }
}