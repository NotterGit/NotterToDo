import { z } from "zod"

export const UpdateCard = z.object({
    boardId: z.string(),
    description: z.optional(
        z.string({
            message: "Описание обязательно"
        }).min(3, {
            message: "Описание слишком короткое"
        })
    ),
    title: z.optional(z.string({
        message: "Название обязательно"
    }).min(3, {
        message: "Название слишком короткое"
    })),
    id: z.string()
})