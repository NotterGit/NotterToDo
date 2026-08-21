import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { ListContainer } from "@/components/dashboard/list/list-container";
import { pages } from "@/config/routing/pages.route";
import type { BoardIdPageProps } from "@/config/types/main.types";

export default async function BoardIdPage({
  params
}: BoardIdPageProps) {
  const { boardId } = await params;
  const { userId, orgId: clerkOrgId } = await auth();
  const orgId = clerkOrgId || userId;

  if (!orgId) {
    redirect(pages.SELECT_ORG);
  }

  const lists = await db.list.findMany({
    where: {
        boardId,
        board: {
          orgId,
        },
      },
      include: {
        cards: {
          orderBy: {
            order: "asc"
          }
        }
      },
      orderBy: {
        order: "asc"
      }
  })

  return (
    <div className="p-4 h-full overflow-x-auto overflow-y-hidden">
      <ListContainer
        boardId={boardId}
        data={lists}
      />
    </div>
  )
}
