import { deleteBoard } from "@/actions/delete-board"
import { FormDelete } from "./form-button"

interface BoardProps {
    title: string
    id: string
}

export default function Board({title, id}: BoardProps) {
  const deleteBoardId = deleteBoard.bind(null, id)

  return (
    <form className="flex items-center gap-x-2" action={deleteBoardId}>
      <p>
        Board title: {title}
      </p>
      <FormDelete/>
    </form>
  )
}
