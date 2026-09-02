import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { notFound, redirect } from "next/navigation";
import { ListContainer } from "@/components/dashboard/list/list-container";
import { pages } from "@/config/routing/pages.route";
import { checkOrgAccess } from "@/lib/org-access";
import { getCachedBoard } from "@/lib/board-queries";
import type { BoardIdPageProps } from "@/config/types/main.types";

export default async function BoardIdPage({
  params
}: BoardIdPageProps) {
  const { boardId } = await params;
  const { userId, orgId: clerkOrgId } = await auth();

  const board = await getCachedBoard(boardId);

  if (!board) {
    notFound();
  }

  const isOwner = userId ? await checkOrgAccess(board.orgId, userId, clerkOrgId) : false;

  if (!isOwner && !board.public) {
    if (!userId) {
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
    <ListContainer
      boardId={boardId}
      data={lists}
      isReadOnly={!isOwner}
    />
  );
}
