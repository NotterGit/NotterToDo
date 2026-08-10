"use client"

import { copyCard } from "@/actions/copy-card";
import { deleteCard } from "@/actions/delete-card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useAction } from "@/hooks/use-action";
import { useCardModal } from "@/hooks/use-card-modal";
import { CardWithList } from "@/types";
import { Copy, Trash } from "lucide-react";
import { useParams } from "next/navigation";
import toast from "react-hot-toast";

interface ActionsProps {
    data: CardWithList
}

export default function Actions({
    data
}: ActionsProps) {
    const params = useParams()
    const cardModal = useCardModal()

    const { execute: executeCopyCard, isLoading: isLoadingCopy } = useAction(copyCard, {
        onSuccess: (data) => {
            cardModal.onClose()
        }
    })
    const { execute: executeDeleteCard, isLoading: isLoadingDelete } = useAction(deleteCard, {
        onSuccess: (data) => {
            cardModal.onClose()
        }
    })

    const onCopy = () => {
        const boardId = params.boardId as string

        toast.promise(executeCopyCard({
            id: data.id,
            boardId
        }), {
            loading: "Copying...",
            success: (data) => `Card '${data.title}' copied`,
            error: (err) => err
        })
    }

    const onDelete = () => {
        const boardId = params.boardId as string

        toast.promise(executeDeleteCard({
            id: data.id,
            boardId
        }), {
            loading: "Deleting...",
            success: (data) => `Card '${data.title}' deleted`,
            error: (err) => err
        })
    }

  return (
    <div className="space-y-2 mt-2">
      <p className="text-xs font-semibold">
        Actions
      </p>
      <Button
        variant="default"
        className="w-full justify-start"
        onClick={onCopy}
        disabled={isLoadingCopy}
      >
        <Copy className="h-4 w-4" />
        Copy
      </Button>
      <Button
        className="w-full justify-start hover:bg-rose-500"
        onClick={onDelete}
        disabled={isLoadingDelete}
      >
        <Trash className="h-4 w-4" />
        Delete
      </Button>
    </div>
  )
}

Actions.Skeleton = function ActionsSkeleton() {
  return (
    <div className="space-y-2 mt-2">
      <Skeleton className="w-20 h-4 bg-neutral-200" />
      <Skeleton className="w-full h-8 bg-neutral-200" />
      <Skeleton className="w-full h-8 bg-neutral-200" />
    </div>
  )
}
