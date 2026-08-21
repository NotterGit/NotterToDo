import { z } from "zod"

export const CreateBoard = z.object({
    title: z.string({
        message: "Название обязательно",
    }).min(3, {
        message: "Название слишком короткое"
    }),
    image: z.string({
        message: "Изображение обязательно"
    })
})