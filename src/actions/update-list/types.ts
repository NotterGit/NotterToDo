import { z } from "zod"
import { UpdateList } from "./schema"
import { List } from "@prisma/client"
import { ActionState } from "@/lib/create-safe-action"

export type InputType = z.infer<typeof UpdateList>
export type ReturnType = ActionState<InputType, List>