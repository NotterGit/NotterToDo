import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { ListContainer } from "@/components/dashboard/list/list-container";
import { pages } from "@/config/routing/pages.route";
import type { BoardIdPageProps } from "@/config/types/main.types";

export default async function BoardIdPage({
  params
}: BoardIdPageProps) {
  const { orgId } = auth();

  if (!orgId) {
    redirect(pages.SELECT_ORG);
  }

  const lists = await db.list.findMany({
    where: {
        boardId: params.boardId,
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
    <div className="p-4 h-full overflow-x-auto">
      <ListContainer
        boardId={params.boardId}
        data={lists}
      />
    </div>
  )
}
