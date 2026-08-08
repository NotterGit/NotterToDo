import { z } from "zod"
import { UpdateListOrder } from "./schema"
import { List } from "@prisma/client"
import { ActionState } from "@/lib/create-safe-action"

export type InputType = z.infer<typeof UpdateListOrder>
export type ReturnType = ActionState<InputType, List[]>