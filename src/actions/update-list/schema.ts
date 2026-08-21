import { z } from "zod"

export const UpdateList = z.object({
    title: z.string({
        message: "Название обязательно"
    }).min(3, {
        message: "Название слишком короткое"
    }),
    id: z.string(),
    boardId: z.string()
})