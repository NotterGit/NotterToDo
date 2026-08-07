import { z } from "zod"
import { UpdateBoard } from "./schema"
import { Board } from "@prisma/client"
import { ActionState } from "@/lib/create-safe-action"

export type InputType = z.infer<typeof UpdateBoard>
export type ReturnType = ActionState<InputType, Board>