import { z } from "zod"
import { UpdateBoardPublic } from "./schema"
import { Board } from "@prisma/client"
import { ActionState } from "@/lib/create-safe-action"

export type InputType = z.infer<typeof UpdateBoardPublic>
export type ReturnType = ActionState<InputType, Board>