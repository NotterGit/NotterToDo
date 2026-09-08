import { z } from "zod"

export const UpdateList = z.object({
    title: z.optional(z.string({
        message: "Название обязательно"
    }).min(1, {
        message: "Название слишком короткое"
    })),
    color: z.optional(z.string().nullable()),
    id: z.string(),
    boardId: z.string()
})