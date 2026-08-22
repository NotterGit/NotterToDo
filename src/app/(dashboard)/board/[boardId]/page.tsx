import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { notFound, redirect } from "next/navigation";
import { ListContainer } from "@/components/dashboard/list/list-container";
import { pages } from "@/config/routing/pages.route";
import type { BoardIdPageProps } from "@/config/types/main.types";

export default async function BoardIdPage({
  params
}: BoardIdPageProps) {
  const { boardId } = await params;
  const { userId, orgId: clerkOrgId } = await auth();
  const orgId = clerkOrgId || userId;

  const board = await db.board.findUnique({
    where: {
      id: boardId
    }
  });

  if (!board) {
    notFound();
  }

  const isOwner = !!(
    (orgId && board.orgId === orgId) ||
    (userId && board.orgId === userId) ||
    (clerkOrgId && board.orgId === clerkOrgId)
  );

  if (!isOwner && !board.public) {
    if (!orgId) {
      redirect(pages.AUTH.SIGN_IN);
    }
    notFound();
  }

  const lists = await db.list.findMany({
    where: {
      boardId,
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
  });

  return (
    <div className="p-4 h-full overflow-x-auto overflow-y-hidden">
      <ListContainer
        boardId={boardId}
        data={lists}
        isReadOnly={!isOwner}
      />
    </div>
  );
}
