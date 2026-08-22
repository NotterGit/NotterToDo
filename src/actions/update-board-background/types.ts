import { z } from "zod"
import { UpdateBoardBackground } from "./schema"
import { Board } from "@prisma/client"
import { ActionState } from "@/lib/create-safe-action"

export type InputType = z.infer<typeof UpdateBoardBackground>
export type ReturnType = ActionState<InputType, Board>
